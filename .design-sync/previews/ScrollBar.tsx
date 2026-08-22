import { ScrollArea, ScrollBar } from "@qr-manager/ui";

const CODES = [
  { name: "Spring launch flyer", slug: "/r/spring-25", scans: "4,812" },
  { name: "Table tent menu", slug: "/r/menu-q3", scans: "1,204" },
  { name: "Conference badge", slug: "/r/expo-badge", scans: "638" },
  { name: "Shelf talker", slug: "/r/shelf-a4", scans: "297" },
];

export function VerticalDefault() {
  return (
    <ScrollArea className="h-40 w-72 rounded-xl border">
      <ul className="p-3 text-sm">
        {[
          "Spring launch flyer",
          "Table tent menu",
          "Conference badge vCard",
          "Reception Wi-Fi",
          "Shelf talker",
          "Loyalty card",
          "Van livery decal",
          "Receipt footer",
        ].map((name) => (
          <li key={name} className="py-1.5">
            {name}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export function WideTable() {
  return (
    <ScrollArea className="w-72 rounded-xl border">
      <table className="w-max text-sm">
        <thead className="text-muted-foreground text-xs uppercase">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Code</th>
            <th className="px-3 py-2 text-left font-medium">Short link</th>
            <th className="px-3 py-2 text-left font-medium">Destination</th>
            <th className="px-3 py-2 text-right font-medium">Scans</th>
          </tr>
        </thead>
        <tbody>
          {CODES.map((code) => (
            <tr key={code.slug} className="border-t">
              <td className="px-3 py-2 whitespace-nowrap">{code.name}</td>
              <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                {code.slug}
              </td>
              <td className="text-muted-foreground px-3 py-2 whitespace-nowrap">
                promo.example.com{code.slug.replace("/r", "")}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {code.scans}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function BothAxes() {
  return (
    <ScrollArea className="bg-muted h-40 w-72 rounded-xl">
      <pre className="w-max p-3 font-mono text-xs leading-relaxed">
        {`14:02:11  /r/spring-25   Dublin, IE    iOS 18.2      webhook 200
13:58:47  /r/menu-q3     Cork, IE      Android 15    webhook 200
13:51:02  /r/spring-25   Dublin, IE    iOS 18.1      webhook 200
13:44:39  /r/expo-badge  Galway, IE    Android 14    no action
13:31:20  /r/shelf-a4    Belfast, GB   iOS 18.2      webhook 504
13:18:55  /r/spring-25   Dublin, IE    macOS 15.3    webhook 200
13:04:12  /r/menu-q3     Limerick, IE  Android 15    webhook 200
12:57:33  /r/spring-25   Dublin, IE    iOS 17.6      webhook 200`}
      </pre>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
