const Home = () => {
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5">
                <div className="text-2xl font-bold text-color mb-8 border-b border-color/20 pb-2">
                    Privacy Policy
                </div>

                <div className="space-y-8 text-color leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">1. Data Controller</h2>
                        <p>The IKAPO Project Team at the University of Oulu acts as the Data Controller for the personal data processed within the ITEE SPOT platform.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">2. Information We Collect</h2>
                        <p>To provide a functional collaborative environment, we collect and process the following categories of data based on our database schema:</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li><strong>Identity & Account Information:</strong> Full name, email address, and avatar URL (via GitHub or email authentication).</li>
                            <li><strong>Academic & Professional Profile:</strong> University, degree level, major, year of study, job title, company name, and company unit.</li>
                            <li><strong>External Identifiers:</strong> Links to GitHub and LinkedIn profiles.</li>
                            <li><strong>Project & Content Data:</strong> Project titles, descriptions, YouTube links, and any information provided in &quot;fun facts&quot; or project files.</li>
                            <li><strong>Technical Identifiers:</strong> Invitation records (member emails) and system logs including IP addresses (stored for a maximum of 24 hours).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">3. Purpose of Processing & Public Visibility</h2>
                        <p>Data is processed strictly to facilitate the matchmaking of students with projects and industry partners. <strong>Important regarding Profile Visibility:</strong></p>
                        <p className="mt-2">By using the platform, your professional profile and project contributions are made visible to other registered participants and authorized judges to facilitate networking and project evaluation. We do not sell or share your data with third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">4. Legal Basis (GDPR)</h2>
                        <p>We process your data based on your <strong>explicit consent</strong> provided during account creation. For system security and log maintenance, we process data based on <strong>legitimate interests</strong>. You have the right to withdraw consent at any time by deleting your profile.</p>
                        <p>Users are advised not to provide special sensitive personal information.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">5. Data Storage and Third-Party Processors</h2>
                        <p>Your data is securely stored and processed using infrastructure provided by <strong>CSC – IT Center for Science (Finland).</strong> All data is hosted within the European Union (EU). We ensure that Data Processing Agreements (DPA) are in place with these providers to guarantee your data is handled in compliance with GDPR.&quot;</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li>
                                <strong>Data Location:</strong> All personal data is hosted on servers located within the
                                <strong> European Union (EU)</strong>, specifically utilizing CSC&apos;s Finnish infrastructure to self-hosting Supabase.
                            </li>
                            <li>
                                <strong>Special Data Handling:</strong> Consistent with CSC requirements, we do not process
                                special categories of personal data (sensitive data) unless explicitly agreed upon.
                            </li>
                            <li><strong>Security Measures:</strong> We implement industry-standard security protocols, including <strong>TLS/SSL encryption</strong> for data in transit and restricted access at the infrastructure level.</li>
                            <li><strong>Infrastructure:</strong> We leverage Supabase&apos;s Row Level Security (RLS) to maintain strict isolation of user data.</li>
                            <li><strong>Data Isolation:</strong> We utilize <strong>Row Level Security (RLS)</strong> within our self-hosted database to ensure that users can only access their own authorized data.</li>
                            <li><strong>Maintenance:</strong> Regular security patches and updates are applied to the self-hosted environment to protect against vulnerabilities.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">6. Your Rights</h2>
                        <p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li><strong>Access & Portability:</strong> The right to request a copy of your stored data in a structured format.</li>
                            <li><strong>Rectification:</strong> The right to update or correct inaccurate data at any time.</li>
                            <li><strong>Erasure:</strong> The right to request the deletion of your account (&quot;Right to be Forgotten&quot;).</li>
                            <li><strong>Restriction:</strong> The right to object to certain processing activities.</li>
                        </ul>
                    </section>

                    <section className="pt-6 border-t border-color/20">
                        <h2 className="text-lg font-semibold text-color mb-2">7. Contact Information</h2>
                        <p>For any inquiries regarding data privacy or to exercise your rights under GDPR, please contact:</p>
                        <p className="font-bold mt-2 text-color">hanna.saarela@oulu.fi</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;