# PeerPrep - G41

## Getting Started

1. Create `.env.local` file in the root directory

2. Add the following lines:

   ```markdown
   MONGO_URI=mongodb+srv://peerprep:peerprep@peerprep-g41.lvzxhrp.mongodb.net/?retryWrites=true&w=majority
   MONGO_DB=peerprep
   MONGO_COLLECTION=users
   MONGO_QN_EASY=question_easy
   MONGO_QN_MEDIUM=question_medium
   MONGO_QN_HARD=question_hard
   NEXTAUTH_SECRET=0jtDHssr83fgtJKroV6DGQ6uD9BXW4+FvPbehI9zUXY=
   NEXTAUTH_URL=http://localhost:3000
   ```

3. In the root directory, run `pnpm install` or `npm install` (`pnpm` is the recommended package manager here, if you do not have `pnpm` installed please try to install it, it is way better than `npm`)

4. Run `pnpm dev`

5. Go to `localhost:3000` and see!
