import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

const PrintHistoryCard = () => {
  const { data: history = [] } = useQuery({
    queryKey: ["print_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("print_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="card-shadow">
      <CardHeader><CardTitle className="flex items-center gap-2"><History size={18} /> Print History</CardTitle></CardHeader>
      <CardContent className="space-y-2 max-h-60 overflow-y-auto">
        {history.map((entry: any) => (
          <div key={entry.id} className="p-2 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{entry.count} stickers</div>
              <div className="text-xs text-muted-foreground">
                {entry.code_from && entry.code_to ? `${entry.code_from} → ${entry.code_to}` : "Bulk print"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{entry.printed_by}</div>
              <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">No print history yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PrintHistoryCard;
