import PageWrapper from "@/components/PageWrapper";

const Contact = () => {
  return (
    <PageWrapper>
      <div className="px-5 md:px-8 lg:px-10 py-10 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Contact</h1>
          <p className="text-muted-foreground leading-relaxed">
            We welcome questions, feedback, and suggestions about the project.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Get in touch</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For project questions, technical issues, or feedback, please contact our team.
          </p>
          <p className="text-sm text-foreground">
            <span className="font-medium">Email:</span> youngpet@byu.edu
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Important note</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This inbox is not monitored as a crisis line or emergency support service.
            If you are in immediate danger or may act on suicidal thoughts, call 911
            or call or text 988 immediately.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Contact;