export default function Terms() {
    return (
        <section className="max-w-4xl mx-auto space-y-8">
            <header className="text-center animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                    Legal
                </p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-slate-600">
                    Last updated: December 19, 2024
                </p>
            </header>

            <div className="card-organic p-8 prose prose-slate max-w-none animate-fade-delay-1">
                <h2>1. Agreement to Terms</h2>
                <p>
                    By accessing and using Farm Manager ("Service"), you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above, please do not use
                    this service.
                </p>

                <h2>2. Use License</h2>
                <p>
                    Permission is granted to temporarily use Farm Manager for personal, non-commercial transitory
                    viewing only. This is the grant of a license, not a transfer of title, and under this license
                    you may not:
                </p>
                <ul>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained in Farm Manager</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>

                <h2>3. User Accounts</h2>
                <p>
                    When you create an account with us, you must provide information that is accurate, complete,
                    and current at all times. Failure to do so constitutes a breach of the Terms, which may result
                    in immediate termination of your account.
                </p>
                <p>
                    You are responsible for safeguarding the password that you use to access the Service and for
                    any activities or actions under your password.
                </p>

                <h2>4. User Data</h2>
                <p>
                    You retain all rights to the data you input into Farm Manager, including but not limited to:
                </p>
                <ul>
                    <li>Flock information and health records</li>
                    <li>Sales and inventory data</li>
                    <li>Customer information</li>
                    <li>Any other farm-related data</li>
                </ul>
                <p>
                    We claim no intellectual property rights over the material you provide to the Service. All
                    materials uploaded remain yours.
                </p>

                <h2>5. Prohibited Uses</h2>
                <p>You may not use our Service:</p>
                <ul>
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>

                <h2>6. Service Availability</h2>
                <p>
                    We do not guarantee that the Service will be available at all times. We may experience hardware,
                    software, or other problems or need to perform maintenance related to the Service, resulting in
                    interruptions, delays, or errors.
                </p>

                <h2>7. Limitations of Liability</h2>
                <p>
                    In no event shall Farm Manager nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h2>8. Indemnification</h2>
                <p>
                    You agree to defend, indemnify and hold harmless Farm Manager and its licensee and licensors,
                    and their employees, contractors, agents, officers and directors, from and against any and all
                    claims, damages, obligations, losses, liabilities, costs or debt, and expenses.
                </p>

                <h2>9. Third-Party Services</h2>
                <p>
                    Our Service may contain links to third-party websites or services that are not owned or
                    controlled by Farm Manager. We have no control over, and assume no responsibility for, the
                    content, privacy policies, or practices of any third-party websites or services.
                </p>

                <h2>10. Termination</h2>
                <p>
                    We may terminate or suspend your account and bar access to the Service immediately, without
                    prior notice or liability, under our sole discretion, for any reason whatsoever, including
                    without limitation if you breach the Terms.
                </p>
                <p>
                    Upon termination, your right to use the Service will immediately cease. If you wish to
                    terminate your account, you may simply discontinue using the Service.
                </p>

                <h2>11. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                    We will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>

                <h2>12. Governing Law</h2>
                <p>
                    These Terms shall be governed and construed in accordance with the laws of Nepal, without
                    regard to its conflict of law provisions.
                </p>

                <h2>13. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us:
                </p>
                <ul>
                    <li>By email: legal@farmmanager.com</li>
                    <li>By visiting this page: farmmanager.com/contact</li>
                </ul>
            </div>

            <div className="text-center py-8 animate-fade-delay-2">
                <p className="text-sm text-slate-500 mb-4">
                    Questions about our terms?
                </p>
                <a href="/help" className="btn-secondary">
                    Contact Support
                </a>
            </div>
        </section>
    );
}
