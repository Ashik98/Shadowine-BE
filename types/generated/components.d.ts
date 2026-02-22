import type { Schema, Struct } from '@strapi/strapi';

export interface HomepageSectionsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_hero_sections';
  info: {
    displayName: 'hero-section';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    headingHighlightedWords: Schema.Attribute.String;
    showReelThumbnail: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    showReelVideo: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'Cta';
  };
  attributes: {
    Label: Schema.Attribute.String;
    Type: Schema.Attribute.Enumeration<['Primary', 'Secondary', 'Outline']>;
    Url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'homepage-sections.hero-section': HomepageSectionsHeroSection;
      'shared.cta': SharedCta;
    }
  }
}
