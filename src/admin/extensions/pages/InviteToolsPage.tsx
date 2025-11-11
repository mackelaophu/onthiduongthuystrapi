// src/admin/extensions/pages/InviteToolsPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@strapi/design-system';
import { Download, Upload } from '@strapi/icons';

const InviteToolsPage = () => {
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);

  const handleExport = async () => {
    try {
      setLoadingExport(true);
      
      const res = await fetch('/api/invite-codes/export', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invite-codes.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert('Export successful!');
    } catch (err) {
      console.error(err);
      alert('Export failed');
    } finally {
      setLoadingExport(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setLoadingImport(true);

      const formData = new FormData();
      formData.append('file', file);

      await fetch('/api/invite-codes/import', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      alert('Import thành công');
    } catch (err) {
      console.error(err);
      alert('Import failed');
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <Box padding={8}>
      <Typography variant="alpha" marginBottom={4}>
        Invite tools
      </Typography>
      <Typography variant="epsilon" color="neutral600" marginBottom={8}>
        Import / export mã mời học từ Excel
      </Typography>

      <Box padding={8} background="neutral0" shadow="filterShadow" hasRadius>
        <Typography variant="beta">Invite code tools</Typography>

        <Box paddingTop={4} style={{ display: 'flex', gap: '1rem' }}>
          <Button
            startIcon={<Download />}
            loading={loadingExport}
            disabled={loadingExport}
            onClick={handleExport}
          >
            Export mã mời học
          </Button>

          <Button
            startIcon={<Upload />}
            loading={loadingImport}
            disabled={loadingImport}
            onClick={() => {
              const input = document.getElementById(
                'invite-import-input'
              ) as HTMLInputElement | null;
              input?.click();
            }}
          >
            Import mã mời học
          </Button>

          <input
            id="invite-import-input"
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InviteToolsPage;
