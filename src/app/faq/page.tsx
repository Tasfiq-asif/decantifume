import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What are decant perfumes?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Decant perfumes are smaller portions of original fragrances
                transferred from full-sized bottles into smaller containers.
                This allows you to try expensive or niche fragrances without
                committing to a full-size bottle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How long do decants last?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our decants typically last 2-3 years when stored properly in a
                cool, dark place. The longevity depends on the fragrance
                composition and storage conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Are your decants authentic?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, all our decants are sourced from authentic, full-sized
                bottles of genuine fragrances. We guarantee the authenticity of
                every product we sell.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What sizes do you offer?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We offer various sizes including 2ml, 5ml, 10ml, and 30ml
                decants. Different fragrances may have different size options
                available.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How do I store my decants?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Store your decants in a cool, dark place away from direct
                sunlight and heat. Keep them upright and tightly sealed to
                preserve the fragrance quality.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
