import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReturnsPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We want you to be completely satisfied with your purchase. If
                you're not happy with your order, we offer a hassle-free return
                policy.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Return Window</h3>
                <p>
                  Items can be returned within 30 days of purchase for a full
                  refund.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Return Conditions</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Items must be unused and in original packaging</li>
                  <li>Decants must be sealed and unopened</li>
                  <li>
                    Return shipping costs are the responsibility of the customer
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Refund Process</h3>
                <p>
                  Once we receive and inspect your returned item, we'll process
                  your refund within 3-5 business days. Refunds will be issued
                  to the original payment method.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Contact Us</h3>
                <p>
                  If you need to initiate a return, please contact our customer
                  service team at support@decant.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
