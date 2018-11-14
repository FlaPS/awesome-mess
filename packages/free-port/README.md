Utility find any free port, bigger then another.
For example you have a busy port 9090, and wonna get any other free port.
This will incremetually check each next port till find free one.

   import findNextFreePort from '@local/free-port'

   const port = 9090

   const freePort = await findNextFreePort(port)
