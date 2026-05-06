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
                        <p>ITEE SPOT is a collaborative tool designed to facilitate connections between students, academic staff, and industry partners within the Faculty of Information Technology and Electrical Engineering (ITEE).</p>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-lg font-semibold text-color mb-2">3. User Registration and Access</h2>
                        <p>Users may register via Email or GitHub. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. </p>
                        <p>Users, who have registered for specific events organised by ITEE are invited to the platform. Hence the use is by invitation only. Access is managed by the platform administrator and access typically given for a three-month period to encourage participants to return to the shared materials and potential further collaboration.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">4. Data Collection & Privacy</h2>
                        <p>Any personal data you provide through the platform registration form or profile settings (such as name, email, university, and professional links) is collected solely for the purpose of connecting you with relevant IKAPO student projects and potential collaboration opportunities.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">5. Third-Party Links</h2>
                        <p>This tool may contain links to external websites or services (e.g., GitHub, LinkedIn). We are not responsible for the content, privacy practices, or availability of any third-party sites. Accessing third-party links is at your own risk.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">6. Modifications</h2>
                        <p>We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Changes will take effect immediately upon being posted. Your continued use of the tool after modifications constitutes acceptance of the updated terms.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-color mb-2">7. Governing Law</h2>
                        <p>These Terms & Conditions shall be governed by and construed in accordance with the laws of Finland. Any disputes arising from the use of this tool shall be subject to the jurisdiction of the courts of Finland.</p>
                    </section>

                    <section className="pt-6 border-t border-color/20">
                        <h2 className="text-lg font-semibold text-color mb-2">8. Contact</h2>
                        <p>If you have any questions about these Terms & Conditions, please contact the IKAPO Project at the University of Oulu:</p>
                        <p className="font-bold mt-2 text-color">hanna.saarela@oulu.fi</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home