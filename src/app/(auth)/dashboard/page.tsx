
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExpenseCart from "./expens_cart";
export default function DashboardPage() {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity Summary</CardTitle>
          <CardDescription>Your recent activity statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Today", "This Week", "This Month"].map((period) => (
              <div
                key={period}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-600">{period}</span>
                <div className="w-2/3 bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.floor(Math.random() * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Tasks</CardTitle>
          <CardDescription>Your upcoming deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Complete project plan",
              "Review pull requests",
              "Team meeting",
            ].map((task) => (
              <li key={task} className="flex items-center">
                <div className="w-4 h-4 border border-gray-300 rounded-sm mr-3"></div>
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common actions you might need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              "New Project",
              "Add Task",
              "Schedule Meeting",
              "Send Message",
            ].map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    <ExpenseCart />
    </>
  );
}
