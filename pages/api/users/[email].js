import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  const {
    query: { email },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          return res.status(200).json({exists: true, user: user.email });
        } else {
          return res.status(404).json({exists: false });
        }
      } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
