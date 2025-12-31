export default function Privacy() {
    return (
        <section className="max-w-4xl mx-auto space-y-8">
            <header className="text-center animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                    Legal
                </p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-600">
                    Last updated: December 19, 2024
                </p>
            </header>

            <div className="card-organic p-8 prose prose-slate max-w-none animate-fade-delay-1">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to Farm Manager ("we," "our," or "us"). We respect your privacy and are committed to
                    protecting your personal data. This privacy policy will inform you about how we look after your
                    personal data and tell you about your privacy rights.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
                <ul>
                    <li><strong>Identity Data:</strong> includes first name,last name, username or similar identifier</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers</li>
                    <li><strong>Farm Data:</strong> includes information about your flocks, sales, inventory, and health logs</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version</li>
                    <li><strong>Usage Data:</strong> includes information about how you use our application</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                    <li>To provide and maintain our Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information so that we can improve our Service</li>
                    <li>To monitor the usage of our Service</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being
                    accidentally lost, used or accessed in an unauthorised way, altered or disclosed. We limit access
                    to your personal data to those employees, agents, contractors and other third parties who have a
                    business need to know.
                </p>

                <h2>5. Data Retention</h2>
                <p>
                    We will only retain your personal data for as long as necessary to fulfil the purposes we collected
                    it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>

                <h2>6. Your Legal Rights</h2>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                <ul>
                    <li>Request access to your personal data</li>
                    <li>Request correction of your personal data</li>
                    <li>Request erasure of your personal data</li>
                    <li>Object to processing of your personal data</li>
                    <li>Request restriction of processing your personal data</li>
                    <li>Request transfer of your personal data</li>
                    <li>Right to withdraw consent</li>
                </ul>

                <h2>7. Cookies</h2>
                <p>
                    We use cookies and similar tracking technologies to track the activity on our Service and hold
                    certain information. You can instruct your browser to refuse all cookies or to indicate when a
                    cookie is being sent.
                </p>

                <h2>8. Third-Party Links</h2>
                <p>
                    Our Service may contain links to third-party websites. We have no control over and assume no
                    responsibility for the content, privacy policies or practices of any third-party sites or services.
                </p>

                <h2>9. Children's Privacy</h2>
                <p>
                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                    identifiable information from anyone under the age of 13.
                </p>

                <h2>10. Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                    the new Privacy Policy on this page and updating the "Last updated" date.
                </p>

                <h2>11. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                    <li>By email: privacy@farmmanager.com</li>
                    <li>By visiting this page on our website: farmmanager.com/contact</li>
                </ul>
            </div>

            <div className="text-center py-8 animate-fade-delay-2">
                <p className="text-sm text-slate-500 mb-4">
                    Have questions about our privacy practices?
                </p>
                <a href="/help" className="btn-secondary">
                    Contact Support
                </a>
            </div>
        </section>
    );
}
