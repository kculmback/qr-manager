import {
  FileImageIcon,
  RotateCwIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  Spinner,
} from "@qr-manager/ui";

const logo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0f766e"/><circle cx="32" cy="32" r="16" fill="#ccfbf1"/><rect x="28" y="12" width="8" height="40" fill="#0f766e"/></svg>`,
  );

export function Basic() {
  return (
    <div className="flex flex-col gap-3">
      <Attachment>
        <AttachmentMedia variant="image">
          <img src={logo} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
          <AttachmentDescription>PNG · 48 KB · 512×512</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove acme-logo-center.png">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment>
        <AttachmentMedia>
          <FileImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-mark.svg</AttachmentTitle>
          <AttachmentDescription>SVG · 6 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove acme-mark.svg">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-col gap-3">
      <Attachment state="idle">
        <AttachmentMedia>
          <UploadIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Drop a logo here</AttachmentTitle>
          <AttachmentDescription>PNG or SVG, up to 2 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger aria-label="Choose a logo file" />
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
          <AttachmentDescription>Uploading · 62%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <FileImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>badge-artwork.tiff</AttachmentTitle>
          <AttachmentDescription>
            Unsupported format — use PNG or SVG
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry upload">
            <RotateCwIcon />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove badge-artwork.tiff">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-col gap-3">
      <Attachment size="default">
        <AttachmentMedia variant="image">
          <img src={logo} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
          <AttachmentDescription>PNG · 48 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="sm">
        <AttachmentMedia variant="image">
          <img src={logo} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
          <AttachmentDescription>PNG · 48 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs">
        <AttachmentMedia variant="image">
          <img src={logo} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}

export function VerticalGroup() {
  return (
    <AttachmentGroup className="w-80">
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src={logo} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-logo.png</AttachmentTitle>
          <AttachmentDescription>48 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove acme-logo.png">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia>
          <FileImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>acme-mark.svg</AttachmentTitle>
          <AttachmentDescription>6 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove acme-mark.svg">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  );
}
