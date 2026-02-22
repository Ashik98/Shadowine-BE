import type { Schema, Struct } from '@strapi/strapi';

export interface HomepageSectionsAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_about_sections';
  info: {
    displayName: 'about-section';
  };
  attributes: {
    avatarImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    description: Schema.Attribute.Blocks;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleHighlightedText: Schema.Attribute.String;
  };
}

export interface HomepageSectionsAddressCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_address_cards';
  info: {
    displayName: 'address-card';
  };
  attributes: {
    addressLine1: Schema.Attribute.String;
    addressLine2: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    phoneNumber: Schema.Attribute.String;
    subTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomepageSectionsContactSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_contact_sections';
  info: {
    displayName: 'contact-section';
  };
  attributes: {
    addressCard: Schema.Attribute.Component<
      'homepage-sections.address-card',
      false
    >;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    socialLinks: Schema.Attribute.Relation<
      'oneToMany',
      'api::social-media.social-media'
    >;
    title: Schema.Attribute.String;
    titlehighlightedWords: Schema.Attribute.String;
  };
}

export interface HomepageSectionsFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_footer_sections';
  info: {
    displayName: 'footer-section';
  };
  attributes: {
    copyrightText: Schema.Attribute.String;
    copyrightYear: Schema.Attribute.String;
    links: Schema.Attribute.Component<'shared.links', true>;
  };
}

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

export interface HomepageSectionsMarqueeItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_marquee_items';
  info: {
    displayName: 'marquee-item';
  };
  attributes: {
    logo: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HomepageSectionsMetricValue extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_metric_values';
  info: {
    displayName: 'metric-value';
  };
  attributes: {
    tagline: Schema.Attribute.String;
    valuePrefix: Schema.Attribute.String;
    valueSuffix: Schema.Attribute.String;
  };
}

export interface HomepageSectionsServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_service_cards';
  info: {
    displayName: 'service-card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageSectionsServiceSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_service_sections';
  info: {
    displayName: 'service-section';
  };
  attributes: {
    cards: Schema.Attribute.Component<'homepage-sections.service-card', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleHighlightedWords: Schema.Attribute.String;
  };
}

export interface HomepageSectionsWorkSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_work_sections';
  info: {
    displayName: 'work-section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    HighlightedSentence: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleHighlightedWords: Schema.Attribute.String;
    workCards: Schema.Attribute.Component<
      'homepage-sections.work-view-card',
      true
    >;
  };
}

export interface HomepageSectionsWorkViewCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_sections_work_view_cards';
  info: {
    displayName: 'work-view-card';
  };
  attributes: {
    publicAccess: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
    video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    year: Schema.Attribute.String;
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

export interface SharedGlobalSetting extends Struct.ComponentSchema {
  collectionName: 'components_shared_global_settings';
  info: {
    displayName: 'global-setting';
  };
  attributes: {
    applicationName: Schema.Attribute.String;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    email: Schema.Attribute.Email;
    favicon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    navItems: Schema.Attribute.Component<'shared.navigation-item', true>;
    phoneNumber: Schema.Attribute.String;
  };
}

export interface SharedLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'links';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_items';
  info: {
    displayName: 'navigation-item';
  };
  attributes: {
    label: Schema.Attribute.String;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'homepage-sections.about-section': HomepageSectionsAboutSection;
      'homepage-sections.address-card': HomepageSectionsAddressCard;
      'homepage-sections.contact-section': HomepageSectionsContactSection;
      'homepage-sections.footer-section': HomepageSectionsFooterSection;
      'homepage-sections.hero-section': HomepageSectionsHeroSection;
      'homepage-sections.marquee-item': HomepageSectionsMarqueeItem;
      'homepage-sections.metric-value': HomepageSectionsMetricValue;
      'homepage-sections.service-card': HomepageSectionsServiceCard;
      'homepage-sections.service-section': HomepageSectionsServiceSection;
      'homepage-sections.work-section': HomepageSectionsWorkSection;
      'homepage-sections.work-view-card': HomepageSectionsWorkViewCard;
      'shared.cta': SharedCta;
      'shared.global-setting': SharedGlobalSetting;
      'shared.links': SharedLinks;
      'shared.navigation-item': SharedNavigationItem;
    }
  }
}
