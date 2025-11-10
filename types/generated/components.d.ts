import type { Schema, Struct } from '@strapi/strapi';

export interface QuizAnswer extends Struct.ComponentSchema {
  collectionName: 'components_quiz_answers';
  info: {
    description: '\u0110\u00E1p \u00E1n cho c\u00E2u h\u1ECFi tr\u1EAFc nghi\u1EC7m';
    displayName: 'Answer';
  };
  attributes: {
    content: Schema.Attribute.String & Schema.Attribute.Required;
    isCorrect: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface QuizCategoryQuota extends Struct.ComponentSchema {
  collectionName: 'components_quiz_category_quotas';
  info: {
    description: 'S\u1ED1 c\u00E2u h\u1ECFi cho t\u1EEBng danh m\u1EE5c trong 1 b\u1ED9 \u0111\u1EC1';
    displayName: 'Category Quota';
  };
  attributes: {
    category: Schema.Attribute.Relation<
      'oneToOne',
      'api::question-category.question-category'
    >;
    questionCount: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'quiz.answer': QuizAnswer;
      'quiz.category-quota': QuizCategoryQuota;
    }
  }
}
