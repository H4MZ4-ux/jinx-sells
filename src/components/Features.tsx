import { Shield, Truck, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Every product tested before shipping",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "2-3 delivery on all UK orders",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert help whenever you need it",
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 place-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group w-full md:max-w-sm lg:col-span-2"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
