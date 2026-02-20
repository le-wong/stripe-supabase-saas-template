import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Star, Check, Coins, UserCheck, Database } from "lucide-react"
import Stripe from 'stripe'
import { ProductList } from "@/components/ProductList"

// Types
interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: Stripe.Price;
}

// This makes the page dynamic instead of static
export const revalidate = 3600 // Revalidate every hour

async function getStripeProducts(): Promise<Stripe.Product[]> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20'
  });

  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  /*return products.data.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    features: product.metadata?.features ? JSON.parse(product.metadata.features) : [],
    price: product.default_price as Stripe.Price
  }));*/
  return products.data;
}

export default async function LandingPage() {
  const products = await getStripeProducts();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-16 flex items-center  bg-white border-b fixed border-b-slate-200 w-full">
        <Link className="flex items-center justify-center" href="#">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </a>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/products">
            All Courses
          </Link>
        </nav>
        <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row ">
            <div className="flex flex-col space-y-4 md:w-1/2 w-full ">
              <div className="space-y-2">
                <h1 className="text-2xl  tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
                  My Super Cool Storefront
                </h1>
                <p className=" text-muted-foreground md:text-xl">
                  Buy my stuff - you won't regret it!
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="w-full md:w-1/2  flex justify-center">
              <Image src="/hero.png" alt="Hero" width={500} height={500} priority />
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-32 bg-muted" id="features">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Our Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Payments</h3>
                <p className="text-muted-foreground text-center">Seamlesly integrate Stripe Billing to capture subscription payments - Webhooks and all</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Auth</h3>
                <p className="text-muted-foreground text-center">Utilize our preexisting Superbase integration to auth your users and secure your app </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Database</h3>
                <p className="text-muted-foreground text-center">Hook into any PostgresDB instance</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-32" id="pricing">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Featured Courses</h2>
            <p className="text-muted-foreground text-center mb-8 md:text-xl">Choose the perfect plan for your needs</p>
            {/*TODO: Replace list with featured products */}
            <ProductList products={products} />
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-32  bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Journey Today</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of satisfied customers and take your business to the next level.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link className="btn" href="#">
                  <Button className=" p-7" >Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-10 md:py-20 lg:py-32" id="testimonials">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">What Our Customers Say</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">&quot;This product has revolutionized our workflow. Highly recommended!&quot;</p>
                  <p className="font-semibold">- Sarah J., CEO</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">&quot;Wow everything is already integrated! Less time configuring, more time building!.&quot;</p>
                  <p className="font-semibold">- Mark T., CTO</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">&quot;We&aposve seen a 200% increase in productivity since implementing this solution.&quot;</p>
                  <p className="font-semibold">- Emily R., Operations Manager</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Acme Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}