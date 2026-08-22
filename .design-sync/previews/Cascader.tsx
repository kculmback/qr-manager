import {
  Cascader,
  CascaderBreadcrumb,
  CascaderColumns,
  CascaderInput,
  CascaderItems,
  CascaderList,
  CascaderNav,
  CascaderPanel,
} from "@qr-manager/ui";

const items = [
  {
    value: "marketing",
    label: "Marketing",
    children: [
      {
        value: "print",
        label: "Print",
        children: [
          { value: "flyers", label: "Flyers" },
          { value: "posters", label: "Posters" },
          { value: "packaging", label: "Packaging inserts" },
        ],
      },
      {
        value: "events",
        label: "Events",
        children: [
          { value: "booth", label: "Trade show booth" },
          { value: "badges", label: "Conference badges" },
        ],
      },
    ],
  },
  {
    value: "operations",
    label: "Operations",
    children: [
      {
        value: "facilities",
        label: "Facilities",
        children: [
          { value: "doors", label: "Door signage" },
          { value: "wifi", label: "Guest Wi-Fi" },
        ],
      },
      {
        value: "assets",
        label: "Asset tags",
        children: [{ value: "laptops", label: "Laptops" }],
      },
    ],
  },
  {
    value: "support",
    label: "Support",
    children: [
      {
        value: "docs",
        label: "Documentation",
        children: [{ value: "setup", label: "Setup guide" }],
      },
    ],
  },
];

export function Drill() {
  return (
    <div className="w-72">
      <Cascader inline items={items} defaultPath={["marketing"]}>
        <CascaderPanel>
          <CascaderNav>
            <CascaderBreadcrumb />
          </CascaderNav>
          <CascaderList>
            <CascaderItems />
          </CascaderList>
        </CascaderPanel>
      </Cascader>
    </div>
  );
}

export function Columns() {
  return (
    <div className="w-[540px]">
      <Cascader inline mode="columns" items={items} defaultPath={["marketing", "print"]}>
        <CascaderPanel>
          <CascaderColumns columnWidth={170} />
        </CascaderPanel>
      </Cascader>
    </div>
  );
}

export function Searchable() {
  return (
    <div className="w-72">
      <Cascader inline items={items} defaultInputValue="fl" searchScope="deep">
        <CascaderPanel>
          <CascaderNav>
            <CascaderInput placeholder="Search categories" />
          </CascaderNav>
          <CascaderList>
            <CascaderItems />
          </CascaderList>
        </CascaderPanel>
      </Cascader>
    </div>
  );
}

export function MultiSelect() {
  return (
    <div className="w-72">
      <Cascader
        inline
        multiple
        cascade
        selectable="all"
        items={items}
        defaultPath={["marketing", "print"]}
        defaultValue={["flyers", "posters"]}
      >
        <CascaderPanel>
          <CascaderNav>
            <CascaderBreadcrumb />
          </CascaderNav>
          <CascaderList>
            <CascaderItems />
          </CascaderList>
        </CascaderPanel>
      </Cascader>
    </div>
  );
}
