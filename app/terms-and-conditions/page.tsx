const Home = () => {
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5">
                <div className="text-2xl font-bold text-color mb-8 border-b border-color/20 pb-2">
                    Terms and Conditions
                </div>

                <div className="space-y-8 text-color leading-relaxed text-sm">
                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing or using ITEE SPOT, you agree to be bound by these Terms & Conditions. This platform is developed and managed by the IKAPO project team at the University of Oulu.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">2. Description of Service</h2>
                        <p>ITEE SPOT is a collaborative platform designed to manage events, hackathons, and project matchmaking. It facilitates connections between students, academic staff, and industry partners within the Faculty of Information Technology and Electrical Engineering (ITEE) through group formation and project showcases.</p>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-lg font-semibold text-color mb-2">3. User Registration and Access</h2>
                        <p>Users may register via Email or GitHub authentication. Access is primarily managed by invitation. By registering, you are responsible for maintaining the confidentiality of your account and all activities (such as project submissions or group interactions) that occur under your profile.</p>
                        <p>Access is typically granted for a specific period (e.g., three months) related to the event lifecycle to encourage participants to collaborate and finalize shared materials. The administrator reserves the right to manage or revoke access based on event requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">4. User Content and Public Visibility</h2>
                        <p>By using the platform, you agree that:</p>
                        <ul className="list-disc ml-6 mt-3 space-y-2">
                            <li><strong>Profile Display:</strong> Your professional details (name, university, job title, and social links) will be visible to other registered participants and judges.</li>
                            <li><strong>Project Submissions:</strong> Content uploaded to the platform, including project descriptions, GitHub repositories, YouTube links, and files, will be shared for evaluation and collaborative purposes.</li>
                            <li><strong>Conduct:</strong> You are solely responsible for the accuracy and legality of the content you post (including &quot;fun facts&quot; and project materials).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">5. Data Privacy</h2>
                        <p>We take your privacy seriously. Personal data collection is limited to what is necessary for event operations (matchmaking, group management, and judging). Please refer to our <strong>Privacy Policy</strong> for detailed information on how we handle your data and your rights under GDPR.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">6. Third-Party Links</h2>
                        <p>ITEE SPOT integrates with and provides links to external services such as GitHub, LinkedIn, and YouTube. We are not responsible for the content, privacy policies, or practices of these third-party services. Accessing these links is at your own risk.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">7. Modifications</h2>
                        <p>We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the platform following any changes constitutes your acceptance of the new Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">8. Governing Law</h2>
                        <p>These Terms & Conditions are governed by the laws of Finland. Any disputes arising from the use of this tool shall be subject to the jurisdiction of the courts of Finland.</p>
                    </section>

                    <section className="pt-6 border-t border-color/20">
                        <h2 className="text-lg font-semibold text-color mb-2">9. Contact</h2>
                        <p>If you have any questions about these Terms & Conditions, please contact the IKAPO Project at the University of Oulu:</p>
                        <p className="font-bold mt-2 text-color">hanna.saarela@oulu.fi</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;