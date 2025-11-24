/**
 * Business Plan PDF Template
 *
 * Generates a professionally branded business plan PDF using project Discovery data
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using default for now, can be customized)
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
      fontWeight: 700,
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    lineHeight: 1.6,
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 20,
    color: '#0f172a',
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 10,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 15,
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 15,
    marginBottom: 8,
    color: '#1e293b',
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    color: '#334155',
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 600,
    color: '#1e293b',
  },
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 6,
    color: '#334155',
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 600,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    paddingHorizontal: 8,
  },
  highlight: {
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: '#94a3b8',
  },
});

interface BusinessPlanData {
  projectName: string;
  creatorName: string;
  category: string;
  startDate: string;
  expectedLaunchDate: string;

  // Discovery data
  brandVision: string;
  brandMission: string;
  brandValues: string;
  brandPersonality: string;

  productCategory: string;
  productDescription: string;
  productDifferentiators: string;
  pricePoint: string;

  targetAgeRange: string;
  targetGender: string;
  targetIncome: string;
  targetLocation: string;
  audiencePainPoints: string;
  audienceAspirations: string;

  toneOfVoice: string;
  aestheticDirection: string;

  inspirationBrands: string;
  competitorBrands: string;
  differentiationStrategy: string;

  contentPillars: string;
  socialMediaFocus: string;
  launchGoals: string;

  // Optional
  colorPreferences?: string;
  mustHaveElements?: string;
  additionalNotes?: string;
}

export const BusinessPlanDocument: React.FC<{ data: BusinessPlanData }> = ({
  data,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (pricePoint: string) => {
    const ranges: Record<string, string> = {
      BUDGET: '$10 - $30',
      MID_RANGE: '$30 - $100',
      PREMIUM: '$100 - $300',
      LUXURY: '$300+',
    };
    return ranges[pricePoint] || pricePoint;
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverTitle}>Business Plan</Text>
          <Text style={styles.coverSubtitle}>{data.projectName}</Text>
          <Text style={styles.coverSubtitle}>by {data.creatorName}</Text>
          <Text style={styles.coverDate}>
            Prepared on {formatDate(new Date().toISOString())}
          </Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.highlight}>
            <Text style={[styles.text, styles.boldText]}>
              Brand Vision
            </Text>
            <Text style={styles.text}>{data.brandVision}</Text>
          </View>
          <Text style={styles.text}>
            {data.projectName} is a {data.productCategory.toLowerCase()} brand
            launching on {formatDate(data.expectedLaunchDate)}. The brand is
            positioned in the {data.pricePoint.toLowerCase().replace('_', '-')}{' '}
            segment, targeting {data.targetGender.toLowerCase()} consumers aged{' '}
            {data.targetAgeRange} in {data.targetLocation}.
          </Text>
          <Text style={styles.text}>
            Our mission is to {data.brandMission.toLowerCase()}, delivering
            products that embody our core values of {data.brandValues}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Key Highlights</Text>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              <Text style={styles.boldText}>Launch Date:</Text>{' '}
              {formatDate(data.expectedLaunchDate)}
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              <Text style={styles.boldText}>Category:</Text>{' '}
              {data.productCategory}
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              <Text style={styles.boldText}>Price Point:</Text>{' '}
              {formatCurrency(data.pricePoint)}
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              <Text style={styles.boldText}>Brand Personality:</Text>{' '}
              {data.brandPersonality}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 1
        </Text>
      </Page>

      {/* Brand Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brand Overview</Text>

          <Text style={styles.subsectionTitle}>Mission Statement</Text>
          <Text style={styles.text}>{data.brandMission}</Text>

          <Text style={styles.subsectionTitle}>Core Values</Text>
          <Text style={styles.text}>{data.brandValues}</Text>

          <Text style={styles.subsectionTitle}>Brand Personality</Text>
          <Text style={styles.text}>{data.brandPersonality}</Text>

          <Text style={styles.subsectionTitle}>Tone of Voice</Text>
          <Text style={styles.text}>
            Our brand communicates with a {data.toneOfVoice.toLowerCase()} tone,
            ensuring all messaging aligns with our brand identity and resonates
            with our target audience.
          </Text>

          <Text style={styles.subsectionTitle}>Aesthetic Direction</Text>
          <Text style={styles.text}>{data.aestheticDirection}</Text>
          {data.colorPreferences && (
            <Text style={styles.text}>
              <Text style={styles.boldText}>Color Preferences:</Text>{' '}
              {data.colorPreferences}
            </Text>
          )}
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 2
        </Text>
      </Page>

      {/* Market Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Analysis</Text>

          <Text style={styles.subsectionTitle}>Target Audience</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Demographic</Text>
              <Text style={styles.tableCell}>Profile</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Age Range</Text>
              <Text style={styles.tableCell}>{data.targetAgeRange}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Gender</Text>
              <Text style={styles.tableCell}>{data.targetGender}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Income Level</Text>
              <Text style={styles.tableCell}>
                {data.targetIncome.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Location</Text>
              <Text style={styles.tableCell}>{data.targetLocation}</Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Customer Pain Points</Text>
          <Text style={styles.text}>{data.audiencePainPoints}</Text>

          <Text style={styles.subsectionTitle}>Customer Aspirations</Text>
          <Text style={styles.text}>{data.audienceAspirations}</Text>

          <Text style={styles.subsectionTitle}>Competitive Landscape</Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Key Competitors:</Text>{' '}
            {data.competitorBrands}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Inspiration Brands:</Text>{' '}
            {data.inspirationBrands}
          </Text>
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 3
        </Text>
      </Page>

      {/* Product Strategy */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Strategy</Text>

          <Text style={styles.subsectionTitle}>Product Description</Text>
          <Text style={styles.text}>{data.productDescription}</Text>

          <Text style={styles.subsectionTitle}>Key Differentiators</Text>
          <Text style={styles.text}>{data.productDifferentiators}</Text>

          <Text style={styles.subsectionTitle}>Differentiation Strategy</Text>
          <Text style={styles.text}>{data.differentiationStrategy}</Text>

          <Text style={styles.subsectionTitle}>Pricing Strategy</Text>
          <Text style={styles.text}>
            {data.projectName} is positioned in the{' '}
            {data.pricePoint.toLowerCase().replace('_', '-')} segment with an
            expected price range of {formatCurrency(data.pricePoint)}. This
            pricing aligns with our target audience's income level and perceived
            value proposition.
          </Text>

          {data.mustHaveElements && (
            <>
              <Text style={styles.subsectionTitle}>Must-Have Elements</Text>
              <Text style={styles.text}>{data.mustHaveElements}</Text>
            </>
          )}
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 4
        </Text>
      </Page>

      {/* Marketing Strategy */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing Strategy</Text>

          <Text style={styles.subsectionTitle}>Content Pillars</Text>
          <Text style={styles.text}>{data.contentPillars}</Text>

          <Text style={styles.subsectionTitle}>Social Media Focus</Text>
          <Text style={styles.text}>{data.socialMediaFocus}</Text>

          <Text style={styles.subsectionTitle}>Launch Goals</Text>
          <Text style={styles.text}>{data.launchGoals}</Text>

          <Text style={styles.subsectionTitle}>Marketing Channels</Text>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              Social Media Marketing (Instagram, TikTok, Facebook)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              Influencer Partnerships and UGC Campaigns
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>Email Marketing and Newsletter</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>
              Paid Advertising (Facebook Ads, Instagram Ads)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.listItem}>PR and Media Outreach</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 5
        </Text>
      </Page>

      {/* Timeline & Milestones */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline & Milestones</Text>

          <Text style={styles.subsectionTitle}>Project Timeline</Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Start Date:</Text>{' '}
            {formatDate(data.startDate)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Expected Launch:</Text>{' '}
            {formatDate(data.expectedLaunchDate)}
          </Text>

          <Text style={styles.subsectionTitle}>Key Milestones</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Phase</Text>
              <Text style={styles.tableCell}>Milestone</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M1</Text>
              <Text style={styles.tableCell}>Discovery & Brand Strategy</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M2-M3</Text>
              <Text style={styles.tableCell}>
                Branding (Logo, Colors, Typography)
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M4-M5</Text>
              <Text style={styles.tableCell}>Product Development</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M6</Text>
              <Text style={styles.tableCell}>Manufacturing & Production</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M7</Text>
              <Text style={styles.tableCell}>Website Build & Testing</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>M8</Text>
              <Text style={styles.tableCell}>Marketing & Pre-Launch</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Launch</Text>
              <Text style={styles.tableCell}>Official Brand Launch</Text>
            </View>
          </View>
        </View>

        {data.additionalNotes && (
          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>Additional Notes</Text>
            <Text style={styles.text}>{data.additionalNotes}</Text>
          </View>
        )}

        <View style={[styles.section, { marginTop: 40 }]}>
          <Text style={styles.text}>
            This business plan outlines the strategic direction for{' '}
            {data.projectName}. It serves as a roadmap for brand development,
            product launch, and market entry. All milestones and strategies are
            subject to refinement based on market feedback and business
            performance.
          </Text>
        </View>

        <Text style={styles.footer}>
          {data.projectName} - Business Plan | Page 6
        </Text>
      </Page>
    </Document>
  );
};
