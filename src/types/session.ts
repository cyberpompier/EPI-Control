export interface SessionContextType {
  session: any;
  loading: boolean;
  userRole: string | null;
  user: any; // Add user property to fix TS2339 errors
}