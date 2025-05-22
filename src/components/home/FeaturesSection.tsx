import { Truck, ShieldCheck, Banknote, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Free Shipping',
    description: 'Free shipping on all orders over $50'
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: 'Easy Returns',
    description: '30-day easy return policy'
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Authentic Fragrances',
    description: '100% genuine, carefully sourced'
  },
  {
    icon: <Banknote className="h-6 w-6" />,
    title: 'Secure Payment',
    description: 'Multiple secure payment options'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 bg-primary/10 p-3 rounded-full text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 