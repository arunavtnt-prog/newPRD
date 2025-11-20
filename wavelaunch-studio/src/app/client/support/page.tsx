/**
 * Client Support Page
 * Help and support resources
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MessageCircle,
  Book,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default async function ClientSupportPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  const supportOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      action: "Send Email",
      href: "mailto:support@wavelaunch.studio",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: MessageCircle,
      title: "Send Message",
      description: "Message your project team directly",
      action: "Go to Messages",
      href: "/client/messages",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Book,
      title: "Knowledge Base",
      description: "Browse guides and documentation",
      action: "View Guides",
      href: "#",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Find answers to common questions",
      action: "View FAQs",
      href: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const faqs = [
    {
      question: "How do I approve a request?",
      answer:
        'Navigate to the Approvals page from the sidebar, select the pending request, review the details, and click "Approve" or provide feedback.',
    },
    {
      question: "How can I upload files?",
      answer:
        'Go to your project page, click on the "Assets" tab, and use the upload button to share files with your team.',
    },
    {
      question: "How do I contact my lead strategist?",
      answer:
        "You can find your lead strategist's contact information on your project page, or use the Messages feature to send them a message directly.",
    },
    {
      question: "What do the project statuses mean?",
      answer:
        "Discovery = Initial research, Planning = Strategy development, In Progress = Active execution, Review = Final checks, Completed = Project finished.",
    },
    {
      question: "How do I track project progress?",
      answer:
        "Each project page shows a progress bar and phase breakdown. You can also view the Timeline tab to see detailed history and milestones.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Help & Support
        </h1>
        <p className="text-muted-foreground mt-1">
          We're here to help you succeed
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.title} className="border-purple-100">
              <CardContent className="p-6 space-y-4">
                <div className={`${option.bgColor} p-3 rounded-lg w-fit`}>
                  <Icon className={`h-6 w-6 ${option.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={option.href}>
                    {option.action}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-purple-100 space-y-2"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Still Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href="mailto:support@wavelaunch.studio">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/client/messages">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Team
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
