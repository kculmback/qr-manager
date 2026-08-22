import { CopyIcon, LinkIcon, SearchIcon } from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@qr-manager/ui";

export function PrefixAndSuffix() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="ig-slug">Short link</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>qr.example.com/r/</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-slug" defaultValue="spring-25" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy short link">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          This is the URL encoded into the QR code.
        </FieldDescription>
      </Field>
    </div>
  );
}

export function IconAndButton() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search codes and campaigns" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <LinkIcon />
        </InputGroupAddon>
        <InputGroupInput defaultValue="https://example.com/spring" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="outline">Test</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export function WithTextarea() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="ig-payload">Webhook body</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="ig-payload"
            rows={3}
            defaultValue={'{ "code": "spring-25", "scans": 1284 }'}
          />
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupText>POST to Home Assistant</InputGroupText>
            <InputGroupButton className="ml-auto" variant="outline">
              Send test
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field data-disabled="true">
          <FieldLabel htmlFor="ig-disabled">Short link</FieldLabel>
          <InputGroup data-disabled="true">
            <InputGroupAddon>
              <InputGroupText>qr.example.com/r/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="ig-disabled" defaultValue="spring-25" disabled />
          </InputGroup>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="ig-invalid">Webhook URL</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LinkIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="ig-invalid"
              defaultValue="http://192.168.1.4/api/webhook"
              aria-invalid
            />
          </InputGroup>
          <FieldError>Private network addresses are blocked.</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
