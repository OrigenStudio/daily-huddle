import { useRouter } from "next/router";
import { useMemo } from "react";
import parseQueryParam from "../../../helpers/parseQueryParam";
import stringifyQueryParam from "../../../helpers/stringifyQueryParam";
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
    const members = parseQueryParam<Member[]>(rawValue, (value) =>
      Array.isArray(value) ? value : []
    );

    return members.reduce<Member[]>((acc, member) => {
      const { id, name } = member || {};
      return id ? [...acc, { id, name: name || id }] : acc;
    }, []);
  }, [rawValue]);
}

export function membersAsQueryParam(members: Member[]): string {
  return stringifyQueryParam(members);
}
