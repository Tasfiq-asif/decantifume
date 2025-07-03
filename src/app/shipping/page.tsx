import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We offer fast and reliable shipping for all our decant perfumes.
                All orders are carefully packaged to ensure your items arrive in
                perfect condition.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Processing Time</h3>
                <p>Orders are typically processed within 1-2 business days.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Shipping Options</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Standard Shipping: 5-7 business days</li>
                  <li>Express Shipping: 2-3 business days</li>
                  <li>Overnight Shipping: 1 business day</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Shipping Costs</h3>
                <p>
                  Shipping costs are calculated at checkout based on your
                  location and selected shipping method. Free shipping is
                  available on orders over $50.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
