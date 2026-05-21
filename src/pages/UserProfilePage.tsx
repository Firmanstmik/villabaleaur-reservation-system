import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { translations } = useLanguage();

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.userProfile.eyebrow}
        title={translations.userProfile.title}
        description={translations.userProfile.description}
      />

      <ScrollReveal>
        <Card className="max-w-4xl">
          <CardContent className="space-y-6 p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[rgba(246,231,193,0.34)] p-5">
              <p className="text-sm text-[#6B7280]">{translations.userProfile.fields.name}</p>
              <p className="mt-1 text-lg font-semibold text-[#102A43]">{user?.name}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[rgba(169,215,232,0.18)] p-5">
              <p className="text-sm text-[#6B7280]">{translations.userProfile.fields.email}</p>
              <p className="mt-1 text-lg font-semibold text-[#102A43]">{user?.phone ?? user?.email}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[rgba(246,231,193,0.34)] p-5">
              <p className="text-sm text-[#6B7280]">{translations.userProfile.fields.role}</p>
              <p className="mt-1 text-lg font-semibold capitalize text-[#102A43]">{user?.role}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[rgba(169,215,232,0.18)] p-5">
              <p className="text-sm text-[#6B7280]">{translations.userProfile.fields.created}</p>
              <p className="mt-1 text-lg font-semibold text-[#102A43]">{user?.created_at?.slice(0, 10)}</p>
            </div>
          </div>

          <Button variant="outline" onClick={logout}>
            {translations.userProfile.logout}
          </Button>
          </CardContent>
        </Card>
      </ScrollReveal>
    </main>
  );
}
