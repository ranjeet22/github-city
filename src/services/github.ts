export interface ContributionCell {
  x: number;
  z: number;
  commits: number;
  date: string;
}

export interface GithubUserData {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  grid: ContributionCell[];
  isMock: boolean;
}

interface ApiContribution {
  date: string;
  count: number;
  color?: string;
  level?: number;
}



/**
 * Calculates current and longest streaks of active contribution days.
 */
function calculateStreaks(contributions: ApiContribution[]) {
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  // Assume contributions are sorted chronologically
  for (let i = 0; i < contributions.length; i++) {
    const count = contributions[i].count;
    if (count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak
  // A streak continues if there was a contribution today or yesterday
  let activeCurrent = 0;
  const hasCommitRecently = contributions.slice(-2).some(c => c.count > 0);
  
  if (hasCommitRecently) {
    for (let i = contributions.length - 1; i >= 0; i--) {
      if (contributions[i].count > 0) {
        activeCurrent++;
      } else {
        // Only break if we've already started counting (meaning there are preceding active days)
        if (activeCurrent > 0) {
          break;
        }
      }
    }
  }
  currentStreak = activeCurrent;

  return { currentStreak, longestStreak };
}

/**
 * Generates realistic mock contribution data for fallback or sandbox use.
 */
export function generateMockData(username: string): GithubUserData {
  const contributions: ApiContribution[] = [];
  const today = new Date();
  
  // Go back 370 days to have 53 full weeks (371 days total)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 370);
  
  // Align start date to Sunday (day 0) to ensure a neat grid representation
  const dayOfWeek = startDate.getDay();
  if (dayOfWeek > 0) {
    startDate.setDate(startDate.getDate() - dayOfWeek);
  }

  let totalContributions = 0;

  for (let i = 0; i < 371; i++) {
    const dateObj = new Date(startDate);
    dateObj.setDate(startDate.getDate() + i);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Generate clustered, organic contributions:
    // Create random wave patterns to simulate active coding sprints and breaks
    const wave = Math.sin(i * 0.05) + Math.cos(i * 0.12);
    let count = 0;

    if (wave > -0.2) {
      // Scale count based on probability
      const rand = Math.random();
      if (rand > 0.8) {
        count = Math.floor(Math.random() * 12) + 6; // Heavy commit day
      } else if (rand > 0.3) {
        count = Math.floor(Math.random() * 5) + 1;  // Normal commit day
      }
    }

    totalContributions += count;
    contributions.push({ date: dateStr, count });
  }

  const { currentStreak, longestStreak } = calculateStreaks(contributions);

  // Map 1D contributions into a 2D coordinate grid of x (weeks) and z (days)
  const grid: ContributionCell[] = contributions.map((c, i) => ({
    x: Math.floor(i / 7),
    z: i % 7,
    commits: c.count,
    date: c.date,
  }));

  return {
    username,
    totalContributions,
    currentStreak,
    longestStreak,
    grid,
    isMock: true,
  };
}

/**
 * Fetches contribution details for a given GitHub username.
 * Supports 'real' (live API) and 'demo' (mock dataset) modes.
 */
export async function fetchGithubData(username: string, mode: 'real' | 'demo'): Promise<GithubUserData> {
  if (mode === 'demo') {
    return generateMockData(username);
  }

  const url = `/api/github/${username}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      let errMsg = `API returned status ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errMsg = errData.error;
        }
      } catch (e) {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errMsg);
    }
    
    const data: GithubUserData = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Failed to fetch live GitHub contributions for ${username}.`, error);
    throw error;
  }
}
