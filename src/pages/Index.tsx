
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { FeatureSteps } from "@/components/ui/feature-steps";

const Index = () => {
  const features = [
    { 
      step: 'Step 1', 
      title: 'Customizable Storylines',
      content: 'Choose from dozens of themes or create your own unique murder mystery scenario.', 
      image: 'https://images.unsplash.com/photo-1723958929247-ef054b525153?q=80&w=2070&auto=format&fit=crop' 
    },
    { 
      step: 'Step 2',
      title: 'Character Profiles',
      content: 'Detailed character backgrounds, motivations, and secrets for all participants.',
      image: 'https://images.unsplash.com/photo-1723931464622-b7df7c71e380?q=80&w=2070&auto=format&fit=crop'
    },
    { 
      step: 'Step 3',
      title: 'Host Guide',
      content: 'Easy-to-follow step-by-step instructions to host a memorable murder mystery event.',
      image: 'https://images.unsplash.com/photo-1725961476494-efa87ae3106a?q=80&w=2070&auto=format&fit=crop'
    },
  ];

  const audiences = [
    {
      title: "Social Hosts and Party Planners",
      description: "Create exciting mysteries without all the work. Turn any get-together into a thrilling mystery adventure in minutes."
    },
    {
      title: "Friend Groups",
      description: "Find new mysteries for your game nights. Make unique stories that keep your friends guessing and engaged."
    },
    {
      title: "Family Gatherings",
      description: "Bring everyone together with mysteries perfect for all ages. Make holiday dinners and reunions more fun without the hassle."
    },
    {
      title: "Special Occasions",
      description: "Get a complete themed murder mystery for your celebration instantly. We handle the details so you can focus on enjoying the event."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        {/* How It Works Section - Updated to remove lines between numbers on mobile */}
        <section className="py-10 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-semibold">1</span>
                    </div>
                    <div className="hidden md:block absolute top-7 left-full h-0.5 w-full -translate-x-7 bg-primary/30"></div>
                  </div>
                  <h3 className="font-medium mb-2">Describe ideal murder mystery.</h3>
                  <p className="text-sm text-muted-foreground">Tell us what theme and features you want in your mystery.</p>
                </div>
                
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-semibold">2</span>
                    </div>
                    <div className="hidden md:block absolute top-7 left-full h-0.5 w-full -translate-x-7 bg-primary/30"></div>
                  </div>
                  <h3 className="font-medium mb-2">The Mystery Machine creates your first version instantly.</h3>
                  <p className="text-sm text-muted-foreground">Our AI generates a complete mystery with characters and clues.</p>
                </div>
                
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-semibold">3</span>
                    </div>
                    <div className="hidden md:block absolute top-7 left-full h-0.5 w-full -translate-x-7 bg-primary/30"></div>
                  </div>
                  <h3 className="font-medium mb-2">Talk to the editor to design and perfect your idea.</h3>
                  <p className="text-sm text-muted-foreground">Refine the mystery with the AI assistant until it's perfect.</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto mb-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-semibold">4</span>
                    </div>
                  </div>
                  <h3 className="font-medium mb-2">Generate PDF guides for you and your friends</h3>
                  <p className="text-sm text-muted-foreground">Download everything you need to host an amazing party.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Steps Component */}
        <FeatureSteps 
          features={features}
          title="Your Journey Starts Here"
          autoPlayInterval={4000}
          imageHeight="h-[500px]"
        />
        
        {/* Audience Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Murder Mystery Parties Made Simple
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {audiences.map((audience, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">{audience.title}</h3>
                  <p className="text-muted-foreground">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl bg-primary rounded-2xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:pr-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to host your party?</h2>
                <p className="text-primary-foreground/90 mb-0">
                  Join thousands of hosts who are creating unforgettable murder mystery experiences.
                </p>
              </div>
              <Button size="lg" variant="secondary" asChild className="whitespace-nowrap">
                <Link to="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Loved by Party Hosts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border shadow-sm">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {["My friends still talk about our murder mystery night. The characters were so detailed and the plot twists were perfect!",
                      "So easy to set up! I was worried about hosting for 12 people, but the materials made it simple and everyone had a blast.",
                      "Third murder mystery party using this service and they keep getting better. The customization options are amazing."][i-1]}
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                      <span className="font-medium text-sm">
                        {["JD", "MK", "AS"][i-1]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {["Jessica Davis", "Mark Klein", "Amanda Smith"][i-1]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {["Party Host", "Corporate Event Planner", "Birthday Celebrant"][i-1]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
