import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import { EyeMeasurement } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface EyeMeasurementCardProps {
  measurement: EyeMeasurement;
}

export function EyeMeasurementCard({ measurement }: EyeMeasurementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Eye Measurement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>SPH</TableHead>
              <TableHead>CYL</TableHead>
              <TableHead>AX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead>OD (Right)</TableHead>
              <TableCell>{measurement.od.sph}</TableCell>
              <TableCell>{measurement.od.cyl}</TableCell>
              <TableCell>{measurement.od.ax}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>OS (Left)</TableHead>
              <TableCell>{measurement.os.sph}</TableCell>
              <TableCell>{measurement.os.cyl}</TableCell>
              <TableCell>{measurement.os.ax}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <p className="font-semibold">PD (Pupillary Distance)</p>
          <p className="font-mono text-lg">{measurement.pd} mm</p>
        </div>
      </CardContent>
    </Card>
  );
}
