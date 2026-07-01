import { getAllEssays, getAllFieldNotes } from "@/lib/content";
import type { Essay, FieldNote } from "@/lib/content/types";
import { getGrowingIdeas } from "./growing-ideas-data";
import { getObservatoryThreads } from "./threads-data";

export interface ObservatoryCollections {
  essays: Essay[];
  fieldNotes: FieldNote[];
  threads: ReturnType<typeof getObservatoryThreads>;
  growingIdeas: ReturnType<typeof getGrowingIdeas>;
}

export function getObservatoryCollections(): ObservatoryCollections {
  return {
    essays: getAllEssays(),
    fieldNotes: getAllFieldNotes(),
    threads: getObservatoryThreads(),
    growingIdeas: getGrowingIdeas(),
  };
}
