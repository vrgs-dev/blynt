import { Header, Hero, HowItWorks, Features, Pricing, CTA, Footer } from '@/components/landing';

export default function LandingPage() {
    return (
        <>
            <div className='bg-background min-h-screen'>
                <Header />
                <main>
                    <Hero />
                    <HowItWorks />
                    <Features />
                    <Pricing />
                    <CTA />
                </main>
                <Footer />
            </div>
        </>
    );
}
