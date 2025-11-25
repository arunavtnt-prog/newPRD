/**
 * Creator Brand Assets Library
 *
 * Download logos, brand guidelines, templates, and other approved assets
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image as ImageIcon, Palette, Type, Package } from "lucide-react";
import Link from "next/link";

export default async function CreatorAssetsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get creator's projects with approved assets
  const projects = await prisma.project.findMany({
    where: {
      projectUsers: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      assets: {
        where: {
          status: "APPROVED",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      files: {
        where: {
          isDeleted: false,
          folder: {
            in: ["GeneratedLogos", "BrandGuidelines", "SocialTemplates", "PackagingDesigns"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const allAssets = projects.flatMap((p) =>
    p.assets.map((a) => ({ ...a, projectName: p.projectName }))
  );

  const assetTypeIcons: Record<string, any> = {
    LOGO: ImageIcon,
    COLOR_PALETTE: Palette,
    TYPOGRAPHY: Type,
    PACKAGING: Package,
    SOCIAL_TEMPLATE: FileText,
  };

  const assetTypeLabels: Record<string, string> = {
    LOGO: "Logo",
    COLOR_PALETTE: "Color Palette",
    TYPOGRAPHY: "Typography",
    PACKAGING: "Packaging Design",
    SOCIAL_TEMPLATE: "Social Template",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand Assets</h1>
        <p className="text-muted-foreground mt-2">
          Download approved logos, guidelines, and templates for your brand
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {allAssets.filter((a) => a.assetType === "LOGO").length}
                </p>
                <p className="text-xs text-muted-foreground">Logos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {allAssets.filter((a) => a.assetType === "COLOR_PALETTE").length}
                </p>
                <p className="text-xs text-muted-foreground">Color Palettes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {allAssets.filter((a) => a.assetType === "SOCIAL_TEMPLATE").length}
                </p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allAssets.length}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets by Project */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Approved brand assets will appear here once they're ready
            </p>
          </CardContent>
        </Card>
      ) : (
        projects.map((project) => {
          const projectAssets = project.assets;
          if (projectAssets.length === 0) return null;

          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{project.projectName}</CardTitle>
                    <CardDescription>
                      {projectAssets.length} approved asset{projectAssets.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Link href={`/creator/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      View Project
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectAssets.map((asset) => {
                    const Icon = assetTypeIcons[asset.assetType] || FileText;
                    return (
                      <div
                        key={asset.id}
                        className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {asset.assetName}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {assetTypeLabels[asset.assetType] || asset.assetType}
                            </p>
                          </div>
                        </div>

                        {asset.fileUrl && (
                          <a
                            href={asset.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
