import { Filters } from "@qr-manager/ui";

const fields = [
  {
    id: "type",
    label: "Code type",
    type: "select" as const,
    options: [
      { value: "url", label: "URL" },
      { value: "wifi", label: "Wi-Fi" },
      { value: "vcard", label: "vCard" },
      { value: "sms", label: "SMS" },
    ],
  },
  { id: "scans", label: "Scans", type: "number" as const },
  { id: "created", label: "Created", type: "date" as const },
  { id: "dynamic", label: "Dynamic", type: "boolean" as const },
  { id: "destination", label: "Destination", type: "text" as const },
];

const basicQuery = {
  id: "root",
  type: "group" as const,
  combinator: "and" as const,
  rules: [
    {
      id: "r1",
      type: "rule" as const,
      path: ["type"],
      operator: "is",
      value: "url",
    },
    {
      id: "r2",
      type: "rule" as const,
      path: ["scans"],
      operator: "gt",
      value: 500,
    },
  ],
};

const advancedQuery = {
  id: "root",
  type: "group" as const,
  combinator: "and" as const,
  rules: [
    {
      id: "r1",
      type: "rule" as const,
      path: ["type"],
      operator: "is",
      value: "url",
    },
    {
      id: "g1",
      type: "group" as const,
      combinator: "or" as const,
      rules: [
        {
          id: "r2",
          type: "rule" as const,
          path: ["scans"],
          operator: "gt",
          value: 1000,
        },
        {
          id: "r3",
          type: "rule" as const,
          path: ["dynamic"],
          operator: "is",
          value: true,
        },
      ],
    },
  ],
};

export function Basic() {
  return (
    <div className="w-[560px]">
      <Filters fields={fields} defaultQuery={basicQuery} />
    </div>
  );
}

export function Empty() {
  return (
    <div className="w-[560px]">
      <Filters fields={fields} />
    </div>
  );
}

export function Advanced() {
  return (
    <div className="w-[560px]">
      <Filters
        fields={fields}
        variant="advanced"
        advancedMode="inline"
        defaultQuery={advancedQuery}
      />
    </div>
  );
}

export function Small() {
  return (
    <div className="w-[560px]">
      <Filters size="sm" fields={fields} defaultQuery={basicQuery} />
    </div>
  );
}
