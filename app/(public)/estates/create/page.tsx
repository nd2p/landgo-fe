import PolicyCard from "./components/policy-card";
import VisibilitySection from "./components/visibility-section";
import CategorySection from "./components/category-section";
import ImageUploadSection from "./components/image-upload-section";
import ContactSection from "./components/contact-section";
import PostTypeSection from "./components/post-type-section";
import { Button } from "@/components/ui/button";

export default function CreateEstatePage() {
  return (
    <div className="flex justify-center bg-background py-10">
      <main className="bg-card rounded-lg shadow-sm w-full max-w-3xl space-y-6 p-6">
        <div className="space-y-8">
          <PolicyCard />
          <VisibilitySection />
          <CategorySection />
          <ImageUploadSection />
          <ContactSection />
          <PostTypeSection />

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline">Hủy bỏ</Button>
            <Button className="bg-blue-400 text-white">Đăng tin ngay</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
