import PageWrapper from "@/components/PageWrapper";

const Privacy = () => {
  return (
    <PageWrapper>
      <div className="px-5 md:px-8 lg:px-10 py-10 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your privacy matters. Because this platform allows users to create accounts
            and write journal entries, we want to be clear about how information is handled.
          </p>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may collect account information, journal entries, and other content
              that users choose to save while using the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">How information is used</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Information is used to provide the app experience, save entries to a user
              account, and support the educational goals of this project.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Sharing and security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This project is not intended to sell personal information. Because this is
              a class project, users should avoid entering highly sensitive information.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Educational use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform was created as part of a student project and may not meet the
              standards of a production healthcare application.
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Privacy;