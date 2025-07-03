import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We strive to provide accurate product descriptions and images.
                However, we do not warrant that product descriptions are
                accurate, complete, reliable, or error-free.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Decant Quality</h3>
                <p>
                  All decants are carefully prepared from authentic fragrances.
                  We guarantee the authenticity of our products and use proper
                  decanting techniques to maintain quality.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By placing an order, you agree to provide accurate and complete
                information. We reserve the right to refuse or cancel orders at
                our discretion.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Pricing</h3>
                <p>
                  All prices are subject to change without notice. We reserve
                  the right to modify prices at any time, but price changes will
                  not affect orders already placed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We aim to process and ship orders promptly. However, delivery
                times may vary depending on location and shipping method
                selected. We are not responsible for delays caused by shipping
                carriers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                In no event shall DECANT Perfumes be liable for any indirect,
                incidental, special, or consequential damages arising out of or
                in connection with your use of our products or services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at legal@decant.com or through our contact page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
