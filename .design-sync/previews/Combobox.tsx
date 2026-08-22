import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  Field,
  FieldLabel,
} from "@qr-manager/ui";

const campaigns = [
  "Spring launch",
  "Summer festival",
  "Reception Wi-Fi",
  "Trade show flyer",
];

const actionGroups = [
  { value: "Webhooks", items: ["Home Assistant", "Custom URL"] },
  { value: "Notify", items: ["Email me", "Push notification"] },
];

export function Open() {
  return (
    <div className="w-72">
      <Field>
        <FieldLabel>Campaign</FieldLabel>
        <Combobox items={campaigns} defaultValue="Spring launch" defaultOpen>
          <ComboboxInput placeholder="Search campaigns…" />
          <ComboboxContent>
            <ComboboxEmpty>No campaigns found.</ComboboxEmpty>
            <ComboboxList>
              {(campaign: string) => (
                <ComboboxItem key={campaign} value={campaign}>
                  {campaign}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  );
}

export function Grouped() {
  return (
    <div className="w-72">
      <Combobox items={actionGroups} defaultValue="Home Assistant" defaultOpen>
        <ComboboxInput placeholder="Search actions…" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No actions found.</ComboboxEmpty>
          <ComboboxList>
            {(group: { value: string; items: string[] }) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(action: string) => (
                    <ComboboxItem key={action} value={action}>
                      {action}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function Closed() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <Field>
        <FieldLabel>Campaign</FieldLabel>
        <Combobox items={campaigns} defaultValue="Spring launch">
          <ComboboxInput placeholder="Search campaigns…" />
          <ComboboxContent>
            <ComboboxList>
              {(campaign: string) => (
                <ComboboxItem key={campaign} value={campaign}>
                  {campaign}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <Field>
        <FieldLabel>Campaign (empty)</FieldLabel>
        <Combobox items={campaigns}>
          <ComboboxInput placeholder="Search campaigns…" />
          <ComboboxContent>
            <ComboboxList>
              {(campaign: string) => (
                <ComboboxItem key={campaign} value={campaign}>
                  {campaign}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  );
}
