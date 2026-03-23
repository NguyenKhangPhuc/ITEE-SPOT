const Home = () => {
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5">
                <div className="text-2xl font-bold text-color mb-8 border-b border-color/20 pb-2">
                    Privacy Policy
                </div>

                <div className="space-y-8 text-color leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">1. Data Controller</h2>
                        <p>The IKAPO Project Team at the University of Oulu acts as the Data Controller for the personal data processed within the ITEE CoLAB platform.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">2. Information We Collect</h2>
                        <p>To provide a functional collaborative environment, we collect the following categories of data:</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li><strong>Account Information:</strong> Email address and Name (provided via Email or GitHub authentication).</li>
                            <li><strong>Academic Profile:</strong> University name, Degree level, and Major.</li>
                            <li><strong>Professional Profile:</strong> Job Title, Company Name, and Company Unit.</li>
                            <li><strong>External Identifiers:</strong> GitHub profile links and LinkedIn profile links.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">3. Purpose of Processing</h2>
                        <p>Data is processed strictly to facilitate the matchmaking of students with relevant projects and industry partners. We do not sell or share your data with third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">4. Legal Basis (GDPR)</h2>
                        <p>We process your data based on your <strong>explicit consent</strong> provided during account creation and profile updates. You have the right to withdraw this consent at any time by deleting your profile.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">5. Data Storage and Security</h2>
                        <p>Your data is securely stored using Supabase Cloud services hosted within the European Union (EU). We implement industry-standard encryption and security protocols to protect your personal information.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">6. Your Rights</h2>
                        <p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li><strong>Access:</strong> The right to request a copy of your stored data.</li>
                            <li><strong>Rectification:</strong> The right to update or correct inaccurate data.</li>
                            <li><strong>Erasure:</strong> The right to request the deletion of your account (&quot;Right to be Forgotten&quot;).</li>
                            <li><strong>Portability:</strong> The right to receive your data in a structured, machine-readable format.</li>
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
export default Home