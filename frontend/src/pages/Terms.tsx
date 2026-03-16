import PageWrapper from "@/components/PageWrapper";

const Terms = () => {
  return (
    <PageWrapper>
      <div className="px-5 md:px-8 lg:px-10 py-10 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Terms of Use</h1>
          <p className="text-muted-foreground leading-relaxed">
            This platform is intended to provide supportive information, reflection tools,
            and access to mental health resources.
          </p>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Educational purpose</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This site was created as a class project and is intended for educational use.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Not medical advice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform does not provide medical advice, diagnosis, or treatment and
              should not replace professional mental health care.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Crisis situations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform is not a crisis response service. If you are in immediate danger
              or may act on suicidal thoughts, call 911 or call or text 988 immediately.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">User responsibility</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users are responsible for how they use the information and tools provided on this site.
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Terms;