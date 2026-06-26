/**
 * Owner gate. A single shared passcode protects the dashboard + privileged API
 * routes. Set OWNER_PASSCODE in the environment for production; a default is
 * used in development so the dashboard works out of the box.
 */
export const OWNER_PASSCODE = process.env.OWNER_PASSCODE || 'punjabi2024';

export function isOwner(req: Request): boolean {
  const key =
    req.headers.get('x-owner-key') ||
    new URL(req.url).searchParams.get('key') ||
    '';
  return key === OWNER_PASSCODE;
}
