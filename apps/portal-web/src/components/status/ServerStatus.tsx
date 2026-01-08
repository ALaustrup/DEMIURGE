"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle } from "lucide-react";

interface ServiceStatus {
  name: string;
  url: string;
  status: "online" | "offline" | "checking";
  responseTime?: number;
}

export function ServerStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "RPC Node", url: "https://rpc.demiurge.cloud/rpc", status: "checking" },
    { name: "GraphQL API", url: "https://api.demiurge.cloud/graphql", status: "checking" },
    { name: "QLOUD OS", url: "https://demiurge.cloud", status: "checking" },
  ]);

  const [overallStatus, setOverallStatus] = useState<"online" | "degraded" | "offline">("checking");

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const checkServices = async () => {
    const results = await Promise.all(
      services.map(async (service) => {
        try {
          const start = Date.now();
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(service.url, {
            method: "HEAD",
            signal: controller.signal,
            cache: "no-store",
          });

          clearTimeout(timeout);
          const responseTime = Date.now() - start;

          return {
            ...service,
            status: response.ok ? ("online" as const) : ("offline" as const),
            responseTime,
          };
        } catch (error) {
          return {
            ...service,
            status: "offline" as const,
            responseTime: undefined,
          };
        }
      })
    );

    setServices(results);

    // Calculate overall status
    const onlineCount = results.filter((s) => s.status === "online").length;
    if (onlineCount === results.length) {
      setOverallStatus("online");
    } else if (onlineCount > 0) {
      setOverallStatus("degraded");
    } else {
      setOverallStatus("offline");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "degraded":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "offline":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />;
      case "degraded":
      case "offline":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4 animate-pulse" />;
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300 ${getStatusColor(overallStatus)}">
      <div className="flex items-center gap-2">
        {getStatusIcon(overallStatus)}
        <span className="text-sm font-semibold">
          {overallStatus === "online" && "All Systems Operational"}
          {overallStatus === "degraded" && "Partial Outage"}
          {overallStatus === "offline" && "System Offline"}
          {overallStatus === "checking" && "Checking Status..."}
        </span>
      </div>

      {/* Tooltip with details on hover */}
      <div className="group relative">
        <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
          ⓘ
        </button>
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-black/95 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-300">{service.name}</span>
                <div className="flex items-center gap-2">
                  {service.responseTime && (
                    <span className="text-gray-500">{service.responseTime}ms</span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                      service.status === "online"
                        ? "bg-green-500/20 text-green-400"
                        : service.status === "checking"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        service.status === "online"
                          ? "bg-green-500"
                          : service.status === "checking"
                          ? "bg-gray-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
