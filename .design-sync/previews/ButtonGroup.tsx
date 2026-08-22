import {
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Input,
} from "@qr-manager/ui";

export function Segmented() {
  return (
    <ButtonGroup>
      <Button variant="outline">Last 7 days</Button>
      <Button variant="outline">30 days</Button>
      <Button variant="outline">All time</Button>
    </ButtonGroup>
  );
}

export function SplitAction() {
  return (
    <ButtonGroup>
      <Button>
        <DownloadIcon data-icon="inline-start" />
        Download PNG
      </Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More download formats">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  );
}

export function WithText() {
  return (
    <ButtonGroup className="w-72">
      <ButtonGroupText>qr.sh/</ButtonGroupText>
      <Input defaultValue="spring-launch" aria-label="Short link slug" />
      <Button variant="outline" size="icon" aria-label="Copy short link">
        <CopyIcon />
      </Button>
    </ButtonGroup>
  );
}

export function IconToolbar() {
  return (
    <div className="flex items-start gap-6">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Edit target">
          <PencilIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Duplicate code">
          <CopyIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Delete code">
          <TrashIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon" aria-label="Edit target">
          <PencilIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Duplicate code">
          <CopyIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Delete code">
          <TrashIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
