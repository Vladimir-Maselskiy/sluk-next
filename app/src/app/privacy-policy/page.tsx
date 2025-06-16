// components/PrivacyPolicy.js
import React from 'react';
import { Divider, Card } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <Card style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
      <Title level={2}>Privacy Policy for Sluk</Title>
      <Text type="secondary">Effective Date: June 16, 2025</Text>

      <Divider />

      <Title level={4}>1. Overview</Title>
      <Paragraph>
        Sluk (“we”, “our”, “us”) is a Chrome extension that allows users to blur
        or hide webpage content based on user-defined keywords. We prioritize
        user privacy and adhere to all relevant Chrome Web Store policies.
      </Paragraph>

      <Divider />

      <Title level={4}>2. Data Collected</Title>
      <Paragraph>
        <Text strong>🔹 User-Provided Data:</Text>
      </Paragraph>
      <Paragraph style={{ paddingLeft: '1.5rem' }}>
        • <Text strong>Keywords:</Text> Users enter terms and phrases to filter
        content.
        <br />• <Text strong>Blur/Hide Preferences:</Text> Settings like effect
        type and intensity.
      </Paragraph>

      <Paragraph>
        <Text strong>🔹 Automatically Collected Data:</Text>
      </Paragraph>
      <Paragraph style={{ paddingLeft: '1.5rem' }}>
        • <Text strong>Email (via chrome.identity):</Text> With user permission,
        Sluk may collect the user’s signed-in Google account email to enable
        personalized settings sync and advanced features. This is used solely
        with explicit user consent and not shared with third parties.
      </Paragraph>

      <Paragraph>
        <Text strong>🔹 HTML Content Processing:</Text>
      </Paragraph>
      <Paragraph style={{ paddingLeft: '1.5rem' }}>
        Sluk processes webpage content (DOM elements and text nodes) locally
        within the browser to apply blur/hide effects. No content is transferred
        outside the user’s device.
      </Paragraph>

      <Divider />

      <Title level={4}>3. Purpose & Use of Data</Title>
      <Paragraph>
        • <Text strong>Local Storage:</Text> All keywords and preferences are
        saved in Chrome <Text code>storage.sync</Text> or{' '}
        <Text code>storage.local</Text>.<br />•{' '}
        <Text strong>Personalization:</Text> Collected email (if opted-in)
        allows syncing these settings across devices.
        <br />• <Text strong>Functionality:</Text> HTML content is scanned and
        transformed dynamically in real-time to apply filters.
      </Paragraph>

      <Divider />

      <Title level={4}>4. Data Sharing & Third Parties</Title>
      <Paragraph>
        • <Text strong>No external sharing:</Text> We do <Text code>not</Text>{' '}
        sell or distribute any data.
        <br />• <Text strong>Controlled access:</Text> Email is used only for
        syncing and optional personalization. No one at Sluk manually reviews
        your data.
      </Paragraph>

      <Divider />

      <Title level={4}>5. Security</Title>
      <Paragraph>
        • All processing is done locally; no data leaves your browser.
        <br />• Email data (if used) is accessed securely via Chrome’s OAuth 2.0
        flow using <Text code>chrome.identity</Text>.<br />• We store data only
        in browser-protected storage—not on external servers.
      </Paragraph>

      <Divider />

      <Title level={4}>6. User Controls</Title>
      <Paragraph>
        • <Text strong>Clear data:</Text> Users can delete keywords and settings
        at any time.
        <br />• <Text strong>Remove extension:</Text> Uninstalling Sluk deletes
        all locally stored data.
        <br />• <Text strong>Disable sync:</Text> You can opt out of Google
        account syncing at any time.
      </Paragraph>

      <Divider />

      <Title level={4}>7. Compliance & Policy Note</Title>
      <Paragraph>
        Sluk processes <Text strong>personal or sensitive user data</Text>{' '}
        (e.g., email and webpage content). We comply with Chrome’s{' '}
        <Link href="#">User Data Policy</Link>: Data use is limited to core
        functionality; no data is used for advertising, analytics, or
        third-party distribution. All data transfer (if email syncing is used)
        is secure and encrypted via HTTPS.
      </Paragraph>

      <Divider />

      <Title level={4}>8. Changes to This Policy</Title>
      <Paragraph>
        We may update this policy periodically. Updates will be reflected with a
        revised “Effective Date.” Users are encouraged to review changes
        regularly.
      </Paragraph>

      <Divider />

      <Title level={4}>9. Contact Us</Title>
      <Paragraph>
        For questions or concerns, email:{' '}
        <Link href="mailto:youremail@example.com">slukextension@gmail.com</Link>
      </Paragraph>
    </Card>
  );
};

export default PrivacyPolicy;
