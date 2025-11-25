"use client";

import { useState } from "react";
import { Plus, CreditCard, AlertCircle, Truck, CheckCircle } from "lucide-react";
import { siApple, siPaypal, siOpenai, siVercel, siFigma, siVisa } from "simple-icons";
import { toast } from "sonner";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, cn } from "@/lib/utils";

function ChipSVG() {
  return (
    <svg enableBackground="new 0 0 132 92" viewBox="0 0 132 92" xmlns="http://www.w3.org/2000/svg" className="w-14">
      <title>Chip</title>
      <rect x="0.5" y="0.5" width="131" height="91" rx="15" className="fill-accent stroke-accent" />
      <rect x="9.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="9.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="9.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="61.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
      <rect x="74.5" y="35.5" width="48" height="21" rx="10.5" className="fill-accent stroke-accent-foreground" />
    </svg>
  );
}

const recentPayments = [
  {
    id: 1,
    icon: siPaypal,
    title: "Advance Payment",
    subtitle: "Received via PayPal for Website Project",
    type: "credit",
    amount: 1200,
    date: "Jul 8",
  },
  {
    id: 2,
    icon: siOpenai,
    title: "ChatGPT Subscription",
    subtitle: "OpenAI monthly subscription",
    type: "debit",
    amount: 20,
    date: "Jul 7",
  },
  {
    id: 3,
    icon: siVercel,
    title: "Vercel Team Subscription",
    subtitle: "Vercel cloud hosting charges",
    type: "debit",
    amount: 160,
    date: "Jul 4",
  },
  {
    id: 4,
    icon: siFigma,
    title: "Figma Pro",
    subtitle: "Figma professional plan",
    type: "debit",
    amount: 35,
    date: "Jul 2",
  },
];

export function AccountOverview() {
  const [physicalCardStatus, setPhysicalCardStatus] = useState<"none" | "ordered" | "shipped" | "activated">("none");
  const [isBlocked, setIsBlocked] = useState(false);

  const handleOrderCard = () => {
    toast.success("Physical card order submitted! You'll receive it within 7-10 business days.");
    setPhysicalCardStatus("ordered");
  };

  const handleBlockCard = () => {
    setIsBlocked(true);
    toast.success("Physical card has been blocked");
  };

  const handleUnblockCard = () => {
    setIsBlocked(false);
    toast.success("Physical card has been unblocked");
  };

  const handleRequestReplacement = () => {
    toast.info("Replacement card request submitted. Your new card will arrive in 7-10 business days.");
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>My Cards</CardTitle>
        <CardDescription>Your card summary, balance, and recent transactions in one view.</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs className="gap-4" defaultValue="virtual">
          <TabsList className="w-full">
            <TabsTrigger value="virtual">Virtual</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
          </TabsList>
          <TabsContent value="virtual">
            <div className="space-y-4">
              <div className="bg-primary relative aspect-8/5 w-full max-w-96 overflow-hidden rounded-xl perspective-distant">
                <div className="absolute top-6 left-6">
                  <SimpleIcon icon={siApple} className="fill-primary-foreground size-8" />
                </div>
                <div className="absolute top-1/2 w-full -translate-y-1/2">
                  <div className="flex items-end justify-between px-6">
                    <span className="text-accent font-mono text-lg leading-none font-medium tracking-wide uppercase">
                      Arham Khan
                    </span>
                    <ChipSVG />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span className="font-medium tabular-nums">•••• •••• 5416</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium tabular-nums">06/09</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CVC</span>
                  <span className="font-medium">•••</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spending Limit</span>
                  <span className="font-medium tabular-nums">$62,000.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-medium tabular-nums">$13,100.06</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" size="sm">
                  Freeze Card
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  Set Limit
                </Button>
                <Button className="flex-1" variant="outline" size="sm">
                  More
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h6 className="text-muted-foreground text-sm uppercase">Recent Payments</h6>

                <div className="space-y-4">
                  {recentPayments.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                        <SimpleIcon icon={transaction.icon} className="size-5" />
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{transaction.subtitle}</p>
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm leading-none font-medium tabular-nums",
                              transaction.type === "debit" ? "text-destructive" : "text-green-500",
                            )}
                          >
                            {formatCurrency(transaction.amount, { noDecimals: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="sm" variant="outline">
                  View All Payments
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="physical">
            <div className="space-y-4">
              {physicalCardStatus === "none" ? (
                /* No card ordered yet */
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                    <CreditCard className="size-8 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold">No Physical Card</h4>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Order a physical card to make in-person purchases and ATM withdrawals
                    </p>
                  </div>
                  <Button onClick={handleOrderCard}>
                    <Plus className="size-4 mr-2" />
                    Order Physical Card
                  </Button>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 max-w-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">Free shipping worldwide</p>
                        <p>Your physical card will arrive in 7-10 business days. Activation is instant via the app.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card ordered/shipped/activated */
                <>
                  {/* Physical Card Display */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-700 relative aspect-8/5 w-full max-w-96 overflow-hidden rounded-xl perspective-distant">
                    <div className="absolute top-6 left-6">
                      <SimpleIcon icon={siVisa} className="fill-white size-12" />
                    </div>
                    <div className="absolute top-1/2 w-full -translate-y-1/2">
                      <div className="flex items-end justify-between px-6">
                        <span className="text-white font-mono text-lg leading-none font-medium tracking-wide uppercase">
                          Arham Khan
                        </span>
                        <ChipSVG />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-end justify-between">
                        <div className="text-white/80 text-xs space-y-1">
                          <p className="font-medium">PHYSICAL CARD</p>
                          <p className="font-mono">•••• •••• •••• 8234</p>
                        </div>
                        {isBlocked && (
                          <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            BLOCKED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Status */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {physicalCardStatus === "ordered" && (
                        <>
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Truck className="size-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Card Ordered</p>
                            <p className="text-xs text-muted-foreground">Processing your order...</p>
                          </div>
                        </>
                      )}
                      {physicalCardStatus === "shipped" && (
                        <>
                          <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                            <Truck className="size-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Card Shipped</p>
                            <p className="text-xs text-muted-foreground">Expected delivery: 5-7 days</p>
                          </div>
                        </>
                      )}
                      {physicalCardStatus === "activated" && (
                        <>
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Card Active</p>
                            <p className="text-xs text-muted-foreground">Ready to use</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Card Number</span>
                      <span className="font-medium tabular-nums">•••• •••• •••• 8234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expiry Date</span>
                      <span className="font-medium tabular-nums">12/28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">CVC</span>
                      <span className="font-medium">•••</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Daily Spending Limit</span>
                      <span className="font-medium tabular-nums">$5,000.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">ATM Withdrawal Limit</span>
                      <span className="font-medium tabular-nums">$1,000.00/day</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2">
                    {isBlocked ? (
                      <Button className="flex-1" variant="default" size="sm" onClick={handleUnblockCard}>
                        Unblock Card
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="destructive" size="sm" onClick={handleBlockCard}>
                        Block Card
                      </Button>
                    )}
                    <Button className="flex-1" variant="outline" size="sm" onClick={handleRequestReplacement}>
                      Request Replacement
                    </Button>
                    <Button className="flex-1" variant="outline" size="sm">
                      Set Limits
                    </Button>
                  </div>

                  <Separator />

                  {/* Shipping Info */}
                  <div className="space-y-3">
                    <h6 className="text-muted-foreground text-sm uppercase">Shipping Information</h6>
                    <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
                      <p className="font-medium">Arham Khan</p>
                      <p className="text-muted-foreground">123 Main Street, Apt 4B</p>
                      <p className="text-muted-foreground">San Francisco, CA 94102</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
