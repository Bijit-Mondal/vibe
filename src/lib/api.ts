import ApiClient from "hmm-api";
import { toast } from "sonner";

const api = new ApiClient({
  toast,
  returnParsedError: true,
});

export default api;
