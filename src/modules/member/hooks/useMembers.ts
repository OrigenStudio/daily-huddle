import { useRouter } from "next/router";
import { useMemo } from "react";
import { Member } from "../types";

export const PARAM_MEMBERS = "members";

export default function useMembers() {
  const members = useRouterMembers();

  return members;
}

function useRouterMembers(): Member[] {
  const router = useRouter();

  const rawValue = router.query[PARAM_MEMBERS];
  return useMemo(() => {
    const rawMembers = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || "";

    let members: null | Member[] = null;
    try {
      members = JSON.parse(rawMembers) as Member[];
    } catch (error) {
      // do nothing
    } finally {
      members = Array.isArray(members) ? members : [];
    }

    return members.reduce<Member[]>((acc, member) => {
      const { id, name } = member || {};
      return id ? [...acc, { id, name: name || id }] : acc;
    }, []);
  }, [rawValue]);
}

export function membersAsQueryParam(members: Member[]): string {
  return JSON.stringify(members);
}
