import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Key } from "lucide-react";

interface License {
  id: string;
  licenseKey: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  projects?: Array<{
    projectId: string;
    validationCount: number;
    lastValidated: string;
  }>;
}

const CustomerPortal: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await fetch("/api/customer/licenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error("Failed to fetch licenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateDownload = async (licenseKey: string) => {
    setRegenerating(licenseKey);
    try {
      const response = await fetch(
        `/api/customer/license/${licenseKey}/regenerate-download`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Open download in new tab
        window.open(data.downloadUrl, "_blank");
        await fetchLicenses(); // Refresh licenses
      }
    } catch (error) {
      console.error("Failed to regenerate download:", error);
    } finally {
      setRegenerating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            License Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your AuthBase Pro licenses and downloads
          </p>
        </div>
        <Badge variant="secondary">
          {licenses.length} License{licenses.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {licenses.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No licenses found"
          description="You don't have any active licenses yet."
          action={{
            label: "Get License",
            onClick: () => {
              window.location.href = "/pricing";
            },
          }}
        />
      ) : (
        <div className="grid gap-6">
          {licenses.map((license) => (
            <Card key={license.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      AuthBase Pro {license.tier}
                      <Badge
                        variant={license.isActive ? "default" : "secondary"}
                        className={
                          license.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                      >
                        {license.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Created on {formatDate(license.createdAt)}
                      {license.expiresAt &&
                        ` • Expires ${formatDate(license.expiresAt)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => regenerateDownload(license.licenseKey)}
                    disabled={regenerating === license.licenseKey}
                    variant="outline"
                    size="sm"
                  >
                    {regenerating === license.licenseKey
                      ? "Generating..."
                      : "Download"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      License Key
                    </label>
                    <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                      {license.licenseKey}
                    </div>
                  </div>

                  {license.projects && license.projects.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active Projects
                      </label>
                      <div className="space-y-2 mt-1">
                        {license.projects.map((project, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {project.projectId}
                            </span>
                            <span className="text-gray-500">
                              {project.validationCount} validations
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
