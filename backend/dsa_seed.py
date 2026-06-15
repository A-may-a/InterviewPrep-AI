# backend/dsa_seed.py
from database import SessionLocal
from models import DSAProblem

db = SessionLocal()

dsa_problems = [

    # ==================== ARRAYS (20 problems) ====================
    {
        "title": "Two Sum",
        "description": "Find two numbers that add up to a target",
        "problem_statement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "topic": "Arrays",
        "difficulty": "easy",
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}
        ],
        "solution": """def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []""",
        "solution_explanation": "Use a hashmap to store each number and its index. For each number, check if its complement (target - num) already exists in the map.",
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Best Time to Buy and Sell Stock",
        "description": "Find maximum profit from buying and selling stock once",
        "problem_statement": "Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit you can achieve. You may only buy once and sell once.",
        "topic": "Arrays",
        "difficulty": "easy",
        "examples": [
            {"input": "prices = [7,1,5,3,6,4]", "output": "5"},
            {"input": "prices = [7,6,4,3,1]", "output": "0"}
        ],
        "solution": """def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit""",
        "solution_explanation": "Track the minimum price seen so far and the maximum profit achievable at each step.",
        "constraints": "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Contains Duplicate",
        "description": "Check if array contains any duplicates",
        "problem_statement": "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
        "topic": "Arrays",
        "difficulty": "easy",
        "examples": [
            {"input": "nums = [1,2,3,1]", "output": "true"},
            {"input": "nums = [1,2,3,4]", "output": "false"}
        ],
        "solution": """def containsDuplicate(nums):
    return len(nums) != len(set(nums))""",
        "solution_explanation": "Convert array to set (removes duplicates). If lengths differ, duplicates existed.",
        "constraints": "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Product of Array Except Self",
        "description": "Return array where each element is product of all others",
        "problem_statement": "Given integer array nums, return an array answer such that answer[i] equals the product of all elements except nums[i]. Must run in O(n) without division.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,2,3,4]", "output": "[24,12,8,6]"},
            {"input": "nums = [-1,1,0,-3,3]", "output": "[0,0,9,0,0]"}
        ],
        "solution": """def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    
    # Left pass: result[i] = product of all elements left of i
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Right pass: multiply by product of all elements right of i
    suffix = 1
    for i in range(n-1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result""",
        "solution_explanation": "Two passes: left pass computes prefix products, right pass multiplies by suffix products.",
        "constraints": "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Maximum Subarray (Kadane's Algorithm)",
        "description": "Find contiguous subarray with the largest sum",
        "problem_statement": "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6"},
            {"input": "nums = [1]", "output": "1"}
        ],
        "solution": """def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum""",
        "solution_explanation": "Kadane's algorithm: at each position, decide whether to extend previous subarray or start fresh.",
        "constraints": "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Maximum Product Subarray",
        "description": "Find contiguous subarray with largest product",
        "problem_statement": "Given an integer array nums, find a contiguous non-empty subarray with the largest product and return the product.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [2,3,-2,4]", "output": "6"},
            {"input": "nums = [-2,0,-1]", "output": "0"}
        ],
        "solution": """def maxProduct(nums):
    max_prod = nums[0]
    min_prod = nums[0]
    result = nums[0]
    
    for num in nums[1:]:
        candidates = (num, max_prod * num, min_prod * num)
        max_prod = max(candidates)
        min_prod = min(candidates)
        result = max(result, max_prod)
    
    return result""",
        "solution_explanation": "Track both max and min products because a negative times negative becomes positive.",
        "constraints": "1 <= nums.length <= 2 * 10^4\n-10 <= nums[i] <= 10",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Find Minimum in Rotated Sorted Array",
        "description": "Find minimum element in rotated sorted array",
        "problem_statement": "Given a sorted rotated array of unique elements, find the minimum element.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [3,4,5,1,2]", "output": "1"},
            {"input": "nums = [4,5,6,7,0,1,2]", "output": "0"}
        ],
        "solution": """def findMin(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]""",
        "solution_explanation": "Binary search: if mid > right, minimum is in right half. Otherwise it's in left half.",
        "constraints": "n == nums.length\n1 <= n <= 5000\n-5000 <= nums[i] <= 5000\nAll elements are unique.",
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Search in Rotated Sorted Array",
        "description": "Search target in rotated sorted array",
        "problem_statement": "Given a rotated sorted array and a target, return the index of target or -1 if not found.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [4,5,6,7,0,1,2], target = 0", "output": "4"},
            {"input": "nums = [4,5,6,7,0,1,2], target = 3", "output": "-1"}
        ],
        "solution": """def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1""",
        "solution_explanation": "Modified binary search: determine which half is sorted, then check if target is in that half.",
        "constraints": "1 <= nums.length <= 5000\n-10^4 <= nums[i], target <= 10^4",
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "3Sum",
        "description": "Find all triplets that sum to zero",
        "problem_statement": "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]"},
            {"input": "nums = [0,1,1]", "output": "[]"}
        ],
        "solution": """def threeSum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result""",
        "solution_explanation": "Sort array, fix one element, use two pointers for remaining two. Skip duplicates.",
        "constraints": "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Container With Most Water",
        "description": "Find two lines that form container with most water",
        "problem_statement": "Given n vertical lines, find two lines that together with the x-axis form a container that holds the most water.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49"},
            {"input": "height = [1,1]", "output": "1"}
        ],
        "solution": """def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        water = min(height[left], height[right]) * (right - left)
        max_water = max(max_water, water)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water""",
        "solution_explanation": "Two pointers from both ends. Always move the pointer with smaller height to potentially find a larger container.",
        "constraints": "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Merge Intervals",
        "description": "Merge all overlapping intervals",
        "problem_statement": "Given an array of intervals, merge all overlapping intervals and return the result.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"},
            {"input": "intervals = [[1,4],[4,5]]", "output": "[[1,5]]"}
        ],
        "solution": """def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    
    return merged""",
        "solution_explanation": "Sort by start time. For each interval, merge if it overlaps with last merged interval.",
        "constraints": "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4",
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Rotate Array",
        "description": "Rotate array to right by k steps",
        "problem_statement": "Given an array, rotate it to the right by k steps in-place.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,2,3,4,5,6,7], k = 3", "output": "[5,6,7,1,2,3,4]"},
            {"input": "nums = [-1,-100,3,99], k = 2", "output": "[3,99,-1,-100]"}
        ],
        "solution": """def rotate(nums, k):
    n = len(nums)
    k %= n
    
    def reverse(left, right):
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    reverse(0, n-1)
    reverse(0, k-1)
    reverse(k, n-1)""",
        "solution_explanation": "Reverse entire array, then reverse first k elements, then reverse remaining elements.",
        "constraints": "1 <= nums.length <= 10^5\n0 <= k <= 10^5",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Find All Duplicates in Array",
        "description": "Find all elements that appear twice",
        "problem_statement": "Given an integer array where each element appears once or twice, find all elements that appear twice.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [4,3,2,7,8,2,3,1]", "output": "[2,3]"},
            {"input": "nums = [1,1,2]", "output": "[1]"}
        ],
        "solution": """def findDuplicates(nums):
    result = []
    for num in nums:
        idx = abs(num) - 1
        if nums[idx] < 0:
            result.append(abs(num))
        else:
            nums[idx] = -nums[idx]
    return result""",
        "solution_explanation": "Use array values as indices. Negate the value at index. If already negative, it's a duplicate.",
        "constraints": "1 <= nums.length <= 10^5\n1 <= nums[i] <= nums.length",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Subarray Sum Equals K",
        "description": "Count subarrays with sum equal to k",
        "problem_statement": "Given an array of integers and an integer k, return the total number of subarrays whose sum equals k.",
        "topic": "Arrays",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,1,1], k = 2", "output": "2"},
            {"input": "nums = [1,2,3], k = 3", "output": "2"}
        ],
        "solution": """def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    prefix_counts = {0: 1}
    
    for num in nums:
        prefix_sum += num
        count += prefix_counts.get(prefix_sum - k, 0)
        prefix_counts[prefix_sum] = prefix_counts.get(prefix_sum, 0) + 1
    
    return count""",
        "solution_explanation": "Use prefix sums with a hashmap. If prefix_sum - k exists in map, those subarrays sum to k.",
        "constraints": "1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Trapping Rain Water",
        "description": "Calculate how much water can be trapped",
        "problem_statement": "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
        "topic": "Arrays",
        "difficulty": "hard",
        "examples": [
            {"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6"},
            {"input": "height = [4,2,0,3,2,5]", "output": "9"}
        ],
        "solution": """def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water""",
        "solution_explanation": "Two pointers: water at each position = min(max_left, max_right) - height[i].",
        "constraints": "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },

    # ==================== STRINGS (15 problems) ====================
    {
        "title": "Valid Anagram",
        "description": "Check if two strings are anagrams",
        "problem_statement": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        "topic": "Strings",
        "difficulty": "easy",
        "examples": [
            {"input": "s = 'anagram', t = 'nagaram'", "output": "true"},
            {"input": "s = 'rat', t = 'car'", "output": "false"}
        ],
        "solution": """def isAnagram(s, t):
    if len(s) != len(t):
        return False
    
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        count[c] = count.get(c, 0) - 1
        if count[c] < 0:
            return False
    
    return True""",
        "solution_explanation": "Count character frequencies in s, then decrement for t. Any negative count means not an anagram.",
        "constraints": "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Valid Palindrome",
        "description": "Check if string is a palindrome",
        "problem_statement": "Given a string s, return true if it is a palindrome considering only alphanumeric characters and ignoring case.",
        "topic": "Strings",
        "difficulty": "easy",
        "examples": [
            {"input": "s = 'A man, a plan, a canal: Panama'", "output": "true"},
            {"input": "s = 'race a car'", "output": "false"}
        ],
        "solution": """def isPalindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]""",
        "solution_explanation": "Clean string to only alphanumeric, lowercase. Check if it equals its reverse.",
        "constraints": "1 <= s.length <= 2 * 10^5\ns consists of printable ASCII characters.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Find length of longest substring without repeating characters",
        "problem_statement": "Given a string s, find the length of the longest substring without repeating characters.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "s = 'abcabcbb'", "output": "3"},
            {"input": "s = 'bbbbb'", "output": "1"}
        ],
        "solution": """def lengthOfLongestSubstring(s):
    char_index = {}
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len""",
        "solution_explanation": "Sliding window with hashmap to track last seen index of each character.",
        "constraints": "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
        "time_complexity": "O(n)",
        "space_complexity": "O(min(n,m))"
    },
    {
        "title": "Longest Palindromic Substring",
        "description": "Find the longest palindromic substring",
        "problem_statement": "Given a string s, return the longest palindromic substring in s.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "s = 'babad'", "output": "'bab'"},
            {"input": "s = 'cbbd'", "output": "'bb'"}
        ],
        "solution": """def longestPalindrome(s):
    result = ""
    
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left+1:right]
    
    for i in range(len(s)):
        odd = expand(i, i)       # odd length
        even = expand(i, i+1)    # even length
        if len(odd) > len(result):
            result = odd
        if len(even) > len(result):
            result = even
    
    return result""",
        "solution_explanation": "Expand around center for each position. Check both odd and even length palindromes.",
        "constraints": "1 <= s.length <= 1000\ns consists of digits and English letters.",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Group Anagrams",
        "description": "Group strings that are anagrams of each other",
        "problem_statement": "Given an array of strings, group the anagrams together.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "strs = ['eat','tea','tan','ate','nat','bat']", "output": "[['bat'],['nat','tan'],['ate','eat','tea']]"},
        ],
        "solution": """def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    
    return list(groups.values())""",
        "solution_explanation": "Sort each string as key. Strings with same sorted key are anagrams.",
        "constraints": "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters.",
        "time_complexity": "O(n * k log k)",
        "space_complexity": "O(n * k)"
    },
    {
        "title": "Valid Parentheses",
        "description": "Check if parentheses are balanced",
        "problem_statement": "Given a string s containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "topic": "Strings",
        "difficulty": "easy",
        "examples": [
            {"input": "s = '()[]{}'", "output": "true"},
            {"input": "s = '(]'", "output": "false"}
        ],
        "solution": """def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    
    return not stack""",
        "solution_explanation": "Use stack. Push opening brackets. For closing bracket, check if top matches.",
        "constraints": "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Minimum Window Substring",
        "description": "Find minimum window containing all characters of t",
        "problem_statement": "Given strings s and t, return the minimum window substring of s that contains all characters in t.",
        "topic": "Strings",
        "difficulty": "hard",
        "examples": [
            {"input": "s = 'ADOBECODEBANC', t = 'ABC'", "output": "'BANC'"},
            {"input": "s = 'a', t = 'a'", "output": "'a'"}
        ],
        "solution": """def minWindow(s, t):
    from collections import Counter
    need = Counter(t)
    have, total = 0, len(need)
    result = ""
    min_len = float('inf')
    left = 0
    window = {}
    
    for right, char in enumerate(s):
        window[char] = window.get(char, 0) + 1
        if char in need and window[char] == need[char]:
            have += 1
        
        while have == total:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = s[left:right+1]
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1
    
    return result""",
        "solution_explanation": "Sliding window: expand right until all chars covered, then shrink left while maintaining validity.",
        "constraints": "1 <= s.length, t.length <= 10^5\ns and t consist of uppercase and lowercase English letters.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "String to Integer (atoi)",
        "description": "Implement atoi to convert string to integer",
        "problem_statement": "Implement atoi which converts a string to an integer, handling whitespace, sign, and overflow.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "s = '42'", "output": "42"},
            {"input": "s = '   -42'", "output": "-42"},
            {"input": "s = '4193 with words'", "output": "4193"}
        ],
        "solution": """def myAtoi(s):
    s = s.lstrip()
    if not s:
        return 0
    
    sign = 1
    i = 0
    if s[0] in '+-':
        sign = -1 if s[0] == '-' else 1
        i = 1
    
    num = 0
    while i < len(s) and s[i].isdigit():
        num = num * 10 + int(s[i])
        i += 1
    
    num *= sign
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    return max(INT_MIN, min(INT_MAX, num))""",
        "solution_explanation": "Strip whitespace, handle sign, parse digits, handle overflow.",
        "constraints": "0 <= s.length <= 200\ns consists of English letters, digits, ' ', '+', '-', and '.'.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Count and Say",
        "description": "Generate nth term of count-and-say sequence",
        "problem_statement": "The count-and-say sequence is a sequence of strings. Given integer n, return the nth term.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "n = 1", "output": "'1'"},
            {"input": "n = 4", "output": "'1211'"}
        ],
        "solution": """def countAndSay(n):
    result = "1"
    
    for _ in range(n - 1):
        new_result = ""
        i = 0
        while i < len(result):
            count = 1
            while i + count < len(result) and result[i] == result[i + count]:
                count += 1
            new_result += str(count) + result[i]
            i += count
        result = new_result
    
    return result""",
        "solution_explanation": "Iteratively generate each term by counting consecutive same digits.",
        "constraints": "1 <= n <= 30",
        "time_complexity": "O(n * 2^n)",
        "space_complexity": "O(2^n)"
    },
    {
        "title": "Reverse Words in a String",
        "description": "Reverse words in a string",
        "problem_statement": "Given an input string s, reverse the order of the words. A word is a sequence of non-space characters.",
        "topic": "Strings",
        "difficulty": "medium",
        "examples": [
            {"input": "s = 'the sky is blue'", "output": "'blue is sky the'"},
            {"input": "s = '  hello world  '", "output": "'world hello'"}
        ],
        "solution": """def reverseWords(s):
    return ' '.join(s.split()[::-1])""",
        "solution_explanation": "Split by whitespace (handles multiple spaces), reverse list, join with single space.",
        "constraints": "1 <= s.length <= 10^4\ns contains English letters, digits, and spaces.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },

    # ==================== LINKED LISTS (12 problems) ====================
    {
        "title": "Reverse Linked List",
        "description": "Reverse a singly linked list",
        "problem_statement": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        "topic": "Linked Lists",
        "difficulty": "easy",
        "examples": [
            {"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]"},
            {"input": "head = [1,2]", "output": "[2,1]"}
        ],
        "solution": """def reverseList(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    return prev""",
        "solution_explanation": "Iteratively reverse pointers. Keep track of previous, current, and next nodes.",
        "constraints": "0 <= Number of nodes <= 5000\n-5000 <= Node.val <= 5000",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Merge Two Sorted Lists",
        "description": "Merge two sorted linked lists",
        "problem_statement": "Given the heads of two sorted linked lists, merge them into one sorted list and return its head.",
        "topic": "Linked Lists",
        "difficulty": "easy",
        "examples": [
            {"input": "list1 = [1,2,4], list2 = [1,3,4]", "output": "[1,1,2,3,4,4]"},
            {"input": "list1 = [], list2 = [0]", "output": "[0]"}
        ],
        "solution": """def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    curr = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next = list1
            list1 = list1.next
        else:
            curr.next = list2
            list2 = list2.next
        curr = curr.next
    
    curr.next = list1 or list2
    return dummy.next""",
        "solution_explanation": "Use a dummy node. Compare heads of both lists and append the smaller one.",
        "constraints": "0 <= number of nodes <= 50\n-100 <= Node.val <= 100\nBoth lists are sorted in non-decreasing order.",
        "time_complexity": "O(n + m)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Linked List Cycle",
        "description": "Detect if linked list has a cycle",
        "problem_statement": "Given head of a linked list, determine if the linked list has a cycle in it.",
        "topic": "Linked Lists",
        "difficulty": "easy",
        "examples": [
            {"input": "head = [3,2,0,-4], pos = 1", "output": "true"},
            {"input": "head = [1,2], pos = 0", "output": "true"},
            {"input": "head = [1], pos = -1", "output": "false"}
        ],
        "solution": """def hasCycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False""",
        "solution_explanation": "Floyd's cycle detection: slow moves 1 step, fast moves 2. If they meet, there's a cycle.",
        "constraints": "0 <= number of nodes <= 10^4\n-10^5 <= Node.val <= 10^5",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Find Middle of Linked List",
        "description": "Find the middle node of linked list",
        "problem_statement": "Given the head of a singly linked list, return the middle node. If two middle nodes exist, return the second one.",
        "topic": "Linked Lists",
        "difficulty": "easy",
        "examples": [
            {"input": "head = [1,2,3,4,5]", "output": "[3,4,5]"},
            {"input": "head = [1,2,3,4,5,6]", "output": "[4,5,6]"}
        ],
        "solution": """def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow""",
        "solution_explanation": "Fast and slow pointers. When fast reaches end, slow is at middle.",
        "constraints": "1 <= number of nodes <= 100\n1 <= Node.val <= 100",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Remove Nth Node From End",
        "description": "Remove the nth node from end of list",
        "problem_statement": "Given the head of a linked list, remove the nth node from the end and return its head.",
        "topic": "Linked Lists",
        "difficulty": "medium",
        "examples": [
            {"input": "head = [1,2,3,4,5], n = 2", "output": "[1,2,3,5]"},
            {"input": "head = [1], n = 1", "output": "[]"}
        ],
        "solution": """def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy
    
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        fast = fast.next
        slow = slow.next
    
    slow.next = slow.next.next
    return dummy.next""",
        "solution_explanation": "Two pointers n+1 apart. When fast hits end, slow is just before the node to remove.",
        "constraints": "1 <= number of nodes <= 30\n0 <= Node.val <= 100\n1 <= n <= size of list",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Merge K Sorted Lists",
        "description": "Merge k sorted linked lists into one sorted list",
        "problem_statement": "Given an array of k linked-lists, each sorted in ascending order, merge all into one sorted list.",
        "topic": "Linked Lists",
        "difficulty": "hard",
        "examples": [
            {"input": "lists = [[1,4,5],[1,3,4],[2,6]]", "output": "[1,1,2,3,4,4,5,6]"},
            {"input": "lists = []", "output": "[]"}
        ],
        "solution": """def mergeKLists(lists):
    import heapq
    heap = []
    
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = curr = ListNode(0)
    
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next""",
        "solution_explanation": "Use min-heap to always pick smallest among k lists. O(N log k) where N is total nodes.",
        "constraints": "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500",
        "time_complexity": "O(N log k)",
        "space_complexity": "O(k)"
    },
    {
        "title": "LRU Cache",
        "description": "Implement LRU Cache",
        "problem_statement": "Design a data structure for Least Recently Used cache with get and put operations in O(1).",
        "topic": "Linked Lists",
        "difficulty": "hard",
        "examples": [
            {"input": "LRUCache(2), put(1,1), put(2,2), get(1)→1, put(3,3), get(2)→-1", "output": "Operations work as expected"}
        ],
        "solution": """class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        # Dummy head and tail
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            self._remove(self.cache[key])
            self._insert(self.cache[key])
            return self.cache[key].val
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        self.cache[key] = Node(key, value)
        self._insert(self.cache[key])
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _insert(self, node):  # Insert before tail
        prev = self.tail.prev
        prev.next = node
        node.prev = prev
        node.next = self.tail
        self.tail.prev = node""",
        "solution_explanation": "Doubly linked list + hashmap. Most recent at tail, LRU at head.",
        "constraints": "1 <= capacity <= 3000\n0 <= key <= 10^4\n0 <= value <= 10^5",
        "time_complexity": "O(1)",
        "space_complexity": "O(capacity)"
    },

    # ==================== TREES (15 problems) ====================
    {
        "title": "Maximum Depth of Binary Tree",
        "description": "Find the maximum depth of binary tree",
        "problem_statement": "Given root of a binary tree, return its maximum depth (number of nodes along the longest path from root to leaf).",
        "topic": "Trees",
        "difficulty": "easy",
        "examples": [
            {"input": "root = [3,9,20,null,null,15,7]", "output": "3"},
            {"input": "root = [1,null,2]", "output": "2"}
        ],
        "solution": """def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))""",
        "solution_explanation": "Recursively find max depth of left and right subtrees, return 1 + max of both.",
        "constraints": "0 <= number of nodes <= 10^4\n-100 <= Node.val <= 100",
        "time_complexity": "O(n)",
        "space_complexity": "O(h)"
    },
    {
        "title": "Invert Binary Tree",
        "description": "Invert/mirror a binary tree",
        "problem_statement": "Given root of a binary tree, invert it and return its root.",
        "topic": "Trees",
        "difficulty": "easy",
        "examples": [
            {"input": "root = [4,2,7,1,3,6,9]", "output": "[4,7,2,9,6,3,1]"},
            {"input": "root = [2,1,3]", "output": "[2,3,1]"}
        ],
        "solution": """def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root""",
        "solution_explanation": "Recursively swap left and right children at each node.",
        "constraints": "0 <= number of nodes <= 100\n-100 <= Node.val <= 100",
        "time_complexity": "O(n)",
        "space_complexity": "O(h)"
    },
    {
        "title": "Same Tree",
        "description": "Check if two binary trees are the same",
        "problem_statement": "Given roots of two binary trees, check if they are the same (structurally identical with same node values).",
        "topic": "Trees",
        "difficulty": "easy",
        "examples": [
            {"input": "p = [1,2,3], q = [1,2,3]", "output": "true"},
            {"input": "p = [1,2], q = [1,null,2]", "output": "false"}
        ],
        "solution": """def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    return (p.val == q.val and 
            isSameTree(p.left, q.left) and 
            isSameTree(p.right, q.right))""",
        "solution_explanation": "Recursively check if values match and both subtrees are same.",
        "constraints": "0 <= number of nodes <= 100\n-10^4 <= Node.val <= 10^4",
        "time_complexity": "O(n)",
        "space_complexity": "O(h)"
    },
    {
        "title": "Binary Tree Level Order Traversal",
        "description": "Traverse binary tree level by level",
        "problem_statement": "Given root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        "topic": "Trees",
        "difficulty": "medium",
        "examples": [
            {"input": "root = [3,9,20,null,null,15,7]", "output": "[[3],[9,20],[15,7]]"},
            {"input": "root = [1]", "output": "[[1]]"}
        ],
        "solution": """def levelOrder(root):
    if not root:
        return []
    
    from collections import deque
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    
    return result""",
        "solution_explanation": "BFS with queue. Process all nodes at each level before moving to next.",
        "constraints": "0 <= number of nodes <= 2000\n-1000 <= Node.val <= 1000",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Validate Binary Search Tree",
        "description": "Check if binary tree is valid BST",
        "problem_statement": "Given root of a binary tree, determine if it is a valid Binary Search Tree (BST).",
        "topic": "Trees",
        "difficulty": "medium",
        "examples": [
            {"input": "root = [2,1,3]", "output": "true"},
            {"input": "root = [5,1,4,null,null,3,6]", "output": "false"}
        ],
        "solution": """def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))""",
        "solution_explanation": "Pass valid range to each node. Left subtree must be less than current, right must be greater.",
        "constraints": "1 <= number of nodes <= 10^4\n-2^31 <= Node.val <= 2^31 - 1",
        "time_complexity": "O(n)",
        "space_complexity": "O(h)"
    },
    {
        "title": "Lowest Common Ancestor of BST",
        "description": "Find LCA of two nodes in BST",
        "problem_statement": "Given a BST and two nodes p and q, find their lowest common ancestor.",
        "topic": "Trees",
        "difficulty": "easy",
        "examples": [
            {"input": "root = [6,2,8,0,4,7,9], p = 2, q = 8", "output": "6"},
            {"input": "root = [6,2,8,0,4,7,9], p = 2, q = 4", "output": "2"}
        ],
        "solution": """def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root""",
        "solution_explanation": "If both nodes are smaller, go left. If both larger, go right. Otherwise current is LCA.",
        "constraints": "2 <= number of nodes <= 10^5\n-10^9 <= Node.val <= 10^9",
        "time_complexity": "O(h)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Binary Tree Right Side View",
        "description": "Return values visible from right side of tree",
        "problem_statement": "Given root of a binary tree, imagine standing on the right side and return values of nodes you can see, ordered from top to bottom.",
        "topic": "Trees",
        "difficulty": "medium",
        "examples": [
            {"input": "root = [1,2,3,null,5,null,4]", "output": "[1,3,4]"},
            {"input": "root = [1,null,3]", "output": "[1,3]"}
        ],
        "solution": """def rightSideView(root):
    from collections import deque
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        for i in range(len(queue)):
            node = queue.popleft()
            if i == len(queue):  # Last node in level
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(node.val)
    
    return result""",
        "solution_explanation": "BFS level order traversal, take last node of each level.",
        "constraints": "0 <= number of nodes <= 100\n-100 <= Node.val <= 100",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Construct Binary Tree from Preorder and Inorder",
        "description": "Build binary tree from traversals",
        "problem_statement": "Given two integer arrays preorder and inorder, construct and return the binary tree.",
        "topic": "Trees",
        "difficulty": "medium",
        "examples": [
            {"input": "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", "output": "[3,9,20,null,null,15,7]"}
        ],
        "solution": """def buildTree(preorder, inorder):
    if not preorder or not inorder:
        return None
    
    root = TreeNode(preorder[0])
    mid = inorder.index(preorder[0])
    
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    
    return root""",
        "solution_explanation": "First element of preorder is root. Find it in inorder to split left and right subtrees.",
        "constraints": "1 <= preorder.length <= 3000\nAll values are unique.",
        "time_complexity": "O(n²)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Path Sum",
        "description": "Check if root-to-leaf path sum equals target",
        "problem_statement": "Given root of binary tree and an integer targetSum, return true if there is a root-to-leaf path such that adding up all the values equals targetSum.",
        "topic": "Trees",
        "difficulty": "easy",
        "examples": [
            {"input": "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", "output": "true"},
            {"input": "root = [1,2,3], targetSum = 5", "output": "false"}
        ],
        "solution": """def hasPathSum(root, targetSum):
    if not root:
        return False
    if not root.left and not root.right:
        return root.val == targetSum
    return (hasPathSum(root.left, targetSum - root.val) or
            hasPathSum(root.right, targetSum - root.val))""",
        "solution_explanation": "Recursively subtract node value from target. At leaf, check if remaining is 0.",
        "constraints": "0 <= number of nodes <= 5000\n-1000 <= Node.val <= 1000\n-1000 <= targetSum <= 1000",
        "time_complexity": "O(n)",
        "space_complexity": "O(h)"
    },

    # ==================== DYNAMIC PROGRAMMING (15 problems) ====================
    {
        "title": "Climbing Stairs",
        "description": "Count ways to climb n stairs",
        "problem_statement": "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. Return the number of distinct ways to climb to the top.",
        "topic": "Dynamic Programming",
        "difficulty": "easy",
        "examples": [
            {"input": "n = 2", "output": "2"},
            {"input": "n = 3", "output": "3"}
        ],
        "solution": """def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b""",
        "solution_explanation": "Fibonacci pattern: ways(n) = ways(n-1) + ways(n-2). Use two variables for O(1) space.",
        "constraints": "1 <= n <= 45",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "House Robber",
        "description": "Maximum money without robbing adjacent houses",
        "problem_statement": "Given an array representing money in each house, find max money you can rob without robbing two adjacent houses.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,2,3,1]", "output": "4"},
            {"input": "nums = [2,7,9,3,1]", "output": "12"}
        ],
        "solution": """def rob(nums):
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = 0, 0
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2, prev1 = prev1, curr
    
    return prev1""",
        "solution_explanation": "At each house, choose max of: skip it (prev1) or rob it (prev2 + current).",
        "constraints": "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Coin Change",
        "description": "Minimum coins to make amount",
        "problem_statement": "Given coins of different denominations and an amount, return the fewest coins needed. Return -1 if not possible.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "coins = [1,2,5], amount = 11", "output": "3"},
            {"input": "coins = [2], amount = 3", "output": "-1"}
        ],
        "solution": """def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1""",
        "solution_explanation": "Bottom-up DP: dp[i] = minimum coins to make amount i. Try each coin for each amount.",
        "constraints": "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
        "time_complexity": "O(amount * n)",
        "space_complexity": "O(amount)"
    },
    {
        "title": "Longest Common Subsequence",
        "description": "Find LCS of two strings",
        "problem_statement": "Given two strings text1 and text2, return the length of their longest common subsequence.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "text1 = 'abcde', text2 = 'ace'", "output": "3"},
            {"input": "text1 = 'abc', text2 = 'abc'", "output": "3"}
        ],
        "solution": """def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]""",
        "solution_explanation": "2D DP table: if chars match, extend LCS by 1; else take max from left or above.",
        "constraints": "1 <= text1.length, text2.length <= 1000\nStrings consist of lowercase English characters.",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m * n)"
    },
    {
        "title": "Longest Increasing Subsequence",
        "description": "Find length of longest increasing subsequence",
        "problem_statement": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [10,9,2,5,3,7,101,18]", "output": "4"},
            {"input": "nums = [0,1,0,3,2,3]", "output": "4"}
        ],
        "solution": """def lengthOfLIS(nums):
    dp = [1] * len(nums)
    
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)""",
        "solution_explanation": "dp[i] = length of LIS ending at index i. For each i, check all j < i.",
        "constraints": "1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4",
        "time_complexity": "O(n²)",
        "space_complexity": "O(n)"
    },
    {
        "title": "0/1 Knapsack Problem",
        "description": "Maximize value in knapsack without exceeding capacity",
        "problem_statement": "Given weights and values of n items and a knapsack capacity W, find maximum value you can put in the knapsack. Each item can be used at most once.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "weights = [1,3,4,5], values = [1,4,5,7], W = 7", "output": "9"},
        ],
        "solution": """def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])
    
    return dp[n][W]""",
        "solution_explanation": "2D DP: for each item, decide to include or exclude. dp[i][w] = max value using first i items with capacity w.",
        "constraints": "1 <= n <= 100\n1 <= W <= 1000\n1 <= weights[i], values[i] <= 100",
        "time_complexity": "O(n * W)",
        "space_complexity": "O(n * W)"
    },
    {
        "title": "Word Break",
        "description": "Check if string can be segmented using dictionary",
        "problem_statement": "Given a string s and dictionary wordDict, return true if s can be segmented into space-separated sequence of dictionary words.",
        "topic": "Dynamic Programming",
        "difficulty": "medium",
        "examples": [
            {"input": "s = 'leetcode', wordDict = ['leet','code']", "output": "true"},
            {"input": "s = 'applepenapple', wordDict = ['apple','pen']", "output": "true"}
        ],
        "solution": """def wordBreak(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]""",
        "solution_explanation": "dp[i] = can s[:i] be segmented. For each position, check if any previous valid position makes s[j:i] a word.",
        "constraints": "1 <= s.length <= 300\n1 <= wordDict.length <= 1000\n1 <= wordDict[i].length <= 20",
        "time_complexity": "O(n³)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Edit Distance",
        "description": "Minimum operations to convert one string to another",
        "problem_statement": "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.",
        "topic": "Dynamic Programming",
        "difficulty": "hard",
        "examples": [
            {"input": "word1 = 'horse', word2 = 'ros'", "output": "3"},
            {"input": "word1 = 'intention', word2 = 'execution'", "output": "5"}
        ],
        "solution": """def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    return dp[m][n]""",
        "solution_explanation": "DP table where dp[i][j] = min ops to convert word1[:i] to word2[:j]. Consider insert, delete, replace.",
        "constraints": "0 <= word1.length, word2.length <= 500\nWords consist of lowercase English letters.",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m * n)"
    },

    # ==================== GRAPHS (12 problems) ====================
    {
        "title": "Number of Islands",
        "description": "Count islands in 2D grid",
        "problem_statement": "Given a 2D grid of '1's (land) and '0's (water), count the number of islands.",
        "topic": "Graphs",
        "difficulty": "medium",
        "examples": [
            {"input": "grid = [['1','1','0'],['0','1','0'],['0','0','1']]", "output": "2"},
        ],
        "solution": """def numIslands(grid):
    if not grid:
        return 0
    
    count = 0
    
    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
            return
        grid[i][j] = '0'  # mark visited
        dfs(i+1, j); dfs(i-1, j)
        dfs(i, j+1); dfs(i, j-1)
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    
    return count""",
        "solution_explanation": "DFS from each unvisited land cell, marking all connected land as visited.",
        "constraints": "1 <= grid.length, grid[i].length <= 300",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m * n)"
    },
    {
        "title": "Course Schedule (Cycle Detection)",
        "description": "Determine if all courses can be finished",
        "problem_statement": "There are numCourses courses. Given prerequisites pairs, return true if you can finish all courses.",
        "topic": "Graphs",
        "difficulty": "medium",
        "examples": [
            {"input": "numCourses = 2, prerequisites = [[1,0]]", "output": "true"},
            {"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "output": "false"}
        ],
        "solution": """def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        graph[b].append(a)
    
    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * numCourses
    
    def has_cycle(node):
        if state[node] == 1:
            return True
        if state[node] == 2:
            return False
        state[node] = 1
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        state[node] = 2
        return False
    
    return not any(has_cycle(i) for i in range(numCourses))""",
        "solution_explanation": "Detect cycle in directed graph using DFS with 3-state coloring (unvisited/visiting/visited).",
        "constraints": "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V + E)"
    },
    {
        "title": "Clone Graph",
        "description": "Deep clone an undirected graph",
        "problem_statement": "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
        "topic": "Graphs",
        "difficulty": "medium",
        "examples": [
            {"input": "adjList = [[2,4],[1,3],[2,4],[1,3]]", "output": "[[2,4],[1,3],[2,4],[1,3]]"}
        ],
        "solution": """def cloneGraph(node):
    if not node:
        return None
    
    cloned = {}
    
    def dfs(node):
        if node in cloned:
            return cloned[node]
        clone = Node(node.val)
        cloned[node] = clone
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        return clone
    
    return dfs(node)""",
        "solution_explanation": "DFS with hashmap to avoid re-creating already cloned nodes.",
        "constraints": "0 <= number of nodes <= 100\n1 <= Node.val <= 100",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)"
    },
    {
        "title": "Flood Fill",
        "description": "Fill connected region with new color",
        "problem_statement": "Given an image (2D array), a starting pixel, and new color, flood fill the image starting from the starting pixel.",
        "topic": "Graphs",
        "difficulty": "easy",
        "examples": [
            {"input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", "output": "[[2,2,2],[2,2,0],[2,0,1]]"}
        ],
        "solution": """def floodFill(image, sr, sc, color):
    old_color = image[sr][sc]
    if old_color == color:
        return image
    
    def dfs(r, c):
        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]):
            return
        if image[r][c] != old_color:
            return
        image[r][c] = color
        dfs(r+1, c); dfs(r-1, c)
        dfs(r, c+1); dfs(r, c-1)
    
    dfs(sr, sc)
    return image""",
        "solution_explanation": "DFS from starting pixel. Change color of all connected pixels with same original color.",
        "constraints": "1 <= m, n <= 50\n0 <= image[i][j], color < 2^16",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m * n)"
    },
    {
        "title": "Shortest Path in Binary Matrix",
        "description": "Find shortest path from top-left to bottom-right",
        "problem_statement": "Given n x n binary matrix, find shortest clear path from top-left to bottom-right. Clear path means all cells are 0.",
        "topic": "Graphs",
        "difficulty": "medium",
        "examples": [
            {"input": "grid = [[0,1],[1,0]]", "output": "2"},
            {"input": "grid = [[0,0,0],[1,1,0],[1,1,0]]", "output": "4"}
        ],
        "solution": """def shortestPathBinaryMatrix(grid):
    from collections import deque
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1
    
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    
    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                queue.append((nr, nc, dist + 1))
    
    return -1""",
        "solution_explanation": "BFS from top-left. Explore all 8 directions. First time we reach bottom-right is shortest path.",
        "constraints": "n == grid.length == grid[i].length\n1 <= n <= 100\ngrid[i][j] is 0 or 1",
        "time_complexity": "O(n²)",
        "space_complexity": "O(n²)"
    },
    {
        "title": "Topological Sort",
        "description": "Return topological ordering of directed graph",
        "problem_statement": "Given a directed acyclic graph, return a topological ordering of its vertices.",
        "topic": "Graphs",
        "difficulty": "medium",
        "examples": [
            {"input": "V = 6, edges = [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]", "output": "[5,4,2,3,1,0]"}
        ],
        "solution": """def topologicalSort(V, edges):
    from collections import defaultdict, deque
    graph = defaultdict(list)
    in_degree = [0] * V
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    queue = deque([i for i in range(V) if in_degree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == V else []""",
        "solution_explanation": "Kahn's algorithm: start with nodes having 0 in-degree, reduce neighbors' in-degrees.",
        "constraints": "1 <= V <= 10^4\n0 <= E <= 10^4",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V + E)"
    },

    # ==================== SORTING & SEARCHING (10 problems) ====================
    {
        "title": "Binary Search",
        "description": "Search for target in sorted array",
        "problem_statement": "Given a sorted array and a target, return the index of target or -1 if not found.",
        "topic": "Searching",
        "difficulty": "easy",
        "examples": [
            {"input": "nums = [-1,0,3,5,9,12], target = 9", "output": "4"},
            {"input": "nums = [-1,0,3,5,9,12], target = 2", "output": "-1"}
        ],
        "solution": """def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1""",
        "solution_explanation": "Classic binary search. Eliminate half the search space each iteration.",
        "constraints": "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll integers are unique and sorted.",
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Merge Sort",
        "description": "Sort an array using merge sort",
        "problem_statement": "Implement merge sort algorithm to sort an array in ascending order.",
        "topic": "Sorting",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [38,27,43,3,9,82,10]", "output": "[3,9,10,27,38,43,82]"},
        ],
        "solution": """def mergeSort(nums):
    if len(nums) <= 1:
        return nums
    
    mid = len(nums) // 2
    left = mergeSort(nums[:mid])
    right = mergeSort(nums[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result""",
        "solution_explanation": "Divide array in half recursively, then merge sorted halves.",
        "constraints": "0 <= nums.length <= 5 * 10^4\n-5 * 10^4 <= nums[i] <= 5 * 10^4",
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Quick Sort",
        "description": "Sort an array using quick sort",
        "problem_statement": "Implement quick sort algorithm to sort an array in ascending order.",
        "topic": "Sorting",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [10,7,8,9,1,5]", "output": "[1,5,7,8,9,10]"},
        ],
        "solution": """def quickSort(nums, low, high):
    if low < high:
        pivot_idx = partition(nums, low, high)
        quickSort(nums, low, pivot_idx - 1)
        quickSort(nums, pivot_idx + 1, high)

def partition(nums, low, high):
    pivot = nums[high]
    i = low - 1
    for j in range(low, high):
        if nums[j] <= pivot:
            i += 1
            nums[i], nums[j] = nums[j], nums[i]
    nums[i+1], nums[high] = nums[high], nums[i+1]
    return i + 1""",
        "solution_explanation": "Choose pivot, partition array around it, recursively sort both halves.",
        "constraints": "0 <= nums.length <= 5 * 10^4",
        "time_complexity": "O(n log n) avg, O(n²) worst",
        "space_complexity": "O(log n)"
    },
    {
        "title": "Find Kth Largest Element",
        "description": "Find kth largest element in array",
        "problem_statement": "Given an integer array nums and integer k, return the kth largest element in the array.",
        "topic": "Sorting",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [3,2,1,5,6,4], k = 2", "output": "5"},
            {"input": "nums = [3,2,3,1,2,4,5,5,6], k = 4", "output": "4"}
        ],
        "solution": """def findKthLargest(nums, k):
    import heapq
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]""",
        "solution_explanation": "Maintain a min-heap of size k. After processing all elements, top of heap is kth largest.",
        "constraints": "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        "time_complexity": "O(n log k)",
        "space_complexity": "O(k)"
    },
    {
        "title": "Search a 2D Matrix",
        "description": "Search for target in sorted 2D matrix",
        "problem_statement": "Given an m x n matrix sorted row-wise and column-wise, return true if target exists.",
        "topic": "Searching",
        "difficulty": "medium",
        "examples": [
            {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "output": "true"},
            {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", "output": "false"}
        ],
        "solution": """def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    row, col = 0, n - 1
    
    while row < m and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    
    return False""",
        "solution_explanation": "Start from top-right corner. If current > target, go left. If current < target, go down.",
        "constraints": "m == matrix.length, n == matrix[i].length\n1 <= m, n <= 300",
        "time_complexity": "O(m + n)",
        "space_complexity": "O(1)"
    },

    # ==================== STACK & QUEUE (8 problems) ====================
    {
        "title": "Min Stack",
        "description": "Design a stack that supports min in O(1)",
        "problem_statement": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
        "topic": "Stack & Queue",
        "difficulty": "medium",
        "examples": [
            {"input": "MinStack(), push(-2), push(0), push(-3), getMin()→-3, pop(), top()→0, getMin()→-2", "output": "Operations work correctly"}
        ],
        "solution": """class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)
    
    def pop(self):
        self.stack.pop()
        self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def getMin(self):
        return self.min_stack[-1]""",
        "solution_explanation": "Use auxiliary min_stack that stores minimum value up to each position.",
        "constraints": "-2^31 <= val <= 2^31 - 1\nAll calls to pop, top and getMin are valid.",
        "time_complexity": "O(1) all operations",
        "space_complexity": "O(n)"
    },
    {
        "title": "Daily Temperatures",
        "description": "Find days until warmer temperature",
        "problem_statement": "Given daily temperatures, return array where answer[i] is the number of days until a warmer temperature. If no future warmer day, answer[i] = 0.",
        "topic": "Stack & Queue",
        "difficulty": "medium",
        "examples": [
            {"input": "temperatures = [73,74,75,71,69,72,76,73]", "output": "[1,1,4,2,1,1,0,0]"},
        ],
        "solution": """def dailyTemperatures(temperatures):
    result = [0] * len(temperatures)
    stack = []  # stores indices
    
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            idx = stack.pop()
            result[idx] = i - idx
        stack.append(i)
    
    return result""",
        "solution_explanation": "Monotonic stack: maintain indices of decreasing temperatures. When warmer found, calculate days.",
        "constraints": "1 <= temperatures.length <= 10^5\n30 <= temperatures[i] <= 100",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Evaluate Reverse Polish Notation",
        "description": "Evaluate expression in postfix notation",
        "problem_statement": "Given array of tokens representing arithmetic expression in Reverse Polish Notation, evaluate the expression.",
        "topic": "Stack & Queue",
        "difficulty": "medium",
        "examples": [
            {"input": "tokens = ['2','1','+','3','*']", "output": "9"},
            {"input": "tokens = ['4','13','5','/','+']", "output": "6"}
        ],
        "solution": """def evalRPN(tokens):
    stack = []
    ops = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
        else:
            stack.append(int(token))
    
    return stack[0]""",
        "solution_explanation": "Use stack. Push numbers. For operators, pop two numbers, compute, push result.",
        "constraints": "1 <= tokens.length <= 10^4\ntokens[i] is an integer or one of '+', '-', '*', '/'.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },

    # ==================== HASHING (8 problems) ====================
    {
        "title": "Top K Frequent Elements",
        "description": "Find k most frequent elements",
        "problem_statement": "Given an integer array nums and k, return the k most frequent elements.",
        "topic": "Hashing",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,1,1,2,2,3], k = 2", "output": "[1,2]"},
            {"input": "nums = [1], k = 1", "output": "[1]"}
        ],
        "solution": """def topKFrequent(nums, k):
    from collections import Counter
    import heapq
    
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)""",
        "solution_explanation": "Count frequencies with Counter, then use heap to find k largest by frequency.",
        "constraints": "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\nk is in range [1, unique elements]",
        "time_complexity": "O(n log k)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Longest Consecutive Sequence",
        "description": "Find longest consecutive elements sequence",
        "problem_statement": "Given an unsorted array, return the length of the longest consecutive elements sequence in O(n).",
        "topic": "Hashing",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [100,4,200,1,3,2]", "output": "4"},
            {"input": "nums = [0,3,7,2,5,8,4,6,0,1]", "output": "9"}
        ],
        "solution": """def longestConsecutive(nums):
    num_set = set(nums)
    max_len = 0
    
    for num in num_set:
        if num - 1 not in num_set:  # Start of sequence
            curr = num
            length = 1
            while curr + 1 in num_set:
                curr += 1
                length += 1
            max_len = max(max_len, length)
    
    return max_len""",
        "solution_explanation": "Convert to set. For each number that starts a sequence (num-1 not in set), count consecutive length.",
        "constraints": "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "First Non-Repeating Character",
        "description": "Find first character that doesn't repeat",
        "problem_statement": "Given a string s, find the first non-repeating character and return its index. Return -1 if none exists.",
        "topic": "Hashing",
        "difficulty": "easy",
        "examples": [
            {"input": "s = 'leetcode'", "output": "0"},
            {"input": "s = 'aabb'", "output": "-1"}
        ],
        "solution": """def firstUniqChar(s):
    from collections import Counter
    count = Counter(s)
    
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    
    return -1""",
        "solution_explanation": "Count all character frequencies, then find first character with count of 1.",
        "constraints": "1 <= s.length <= 10^5\ns consists of only lowercase English letters.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },

    # ==================== RECURSION & BACKTRACKING (10 problems) ====================
    {
        "title": "Subsets",
        "description": "Generate all possible subsets",
        "problem_statement": "Given an integer array nums of unique elements, return all possible subsets (the power set).",
        "topic": "Backtracking",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,2,3]", "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"},
            {"input": "nums = [0]", "output": "[[],[0]]"}
        ],
        "solution": """def subsets(nums):
    result = []
    
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result""",
        "solution_explanation": "Backtracking: at each step, add current subset to result then try adding each remaining element.",
        "constraints": "1 <= nums.length <= 10\n-10 <= nums[i] <= 10\nAll nums are unique.",
        "time_complexity": "O(2^n)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Permutations",
        "description": "Generate all possible permutations",
        "problem_statement": "Given an array nums of distinct integers, return all possible permutations.",
        "topic": "Backtracking",
        "difficulty": "medium",
        "examples": [
            {"input": "nums = [1,2,3]", "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"},
            {"input": "nums = [0,1]", "output": "[[0,1],[1,0]]"}
        ],
        "solution": """def permute(nums):
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack([], nums)
    return result""",
        "solution_explanation": "Backtracking: at each step, try placing each remaining element and recurse.",
        "constraints": "1 <= nums.length <= 6\n-10 <= nums[i] <= 10\nAll integers are unique.",
        "time_complexity": "O(n!)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Combination Sum",
        "description": "Find combinations that sum to target",
        "problem_statement": "Given array of distinct integers candidates and target, return all unique combinations where chosen numbers sum to target. Numbers may be reused.",
        "topic": "Backtracking",
        "difficulty": "medium",
        "examples": [
            {"input": "candidates = [2,3,6,7], target = 7", "output": "[[2,2,3],[7]]"},
            {"input": "candidates = [2,3,5], target = 8", "output": "[[2,2,2,2],[2,3,3],[3,5]]"}
        ],
        "solution": """def combinationSum(candidates, target):
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result""",
        "solution_explanation": "Backtracking: try each candidate, subtract from target, allow reuse of same candidate.",
        "constraints": "1 <= candidates.length <= 30\n2 <= candidates[i] <= 40\nAll candidates are distinct.\n1 <= target <= 40",
        "time_complexity": "O(n^(target/min))",
        "space_complexity": "O(target/min)"
    },
    {
        "title": "N-Queens Problem",
        "description": "Place N queens on N×N chessboard",
        "problem_statement": "Place n queens on an n×n chessboard such that no two queens attack each other. Return all distinct solutions.",
        "topic": "Backtracking",
        "difficulty": "hard",
        "examples": [
            {"input": "n = 4", "output": "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]"},
            {"input": "n = 1", "output": "[['Q']]"}
        ],
        "solution": """def solveNQueens(n):
    result = []
    queens = set()
    pos_diag = set()  # row + col
    neg_diag = set()  # row - col
    
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in queens or (row+col) in pos_diag or (row-col) in neg_diag:
                continue
            queens.add(col)
            pos_diag.add(row+col)
            neg_diag.add(row-col)
            board[row][col] = 'Q'
            backtrack(row + 1)
            queens.remove(col)
            pos_diag.remove(row+col)
            neg_diag.remove(row-col)
            board[row][col] = '.'
    
    backtrack(0)
    return result""",
        "solution_explanation": "Backtracking row by row. Use sets to track occupied columns and diagonals.",
        "constraints": "1 <= n <= 9",
        "time_complexity": "O(n!)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Generate Parentheses",
        "description": "Generate all valid parentheses combinations",
        "problem_statement": "Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
        "topic": "Backtracking",
        "difficulty": "medium",
        "examples": [
            {"input": "n = 3", "output": "['((()))','(()())','(())()','()(())','()()()']"},
            {"input": "n = 1", "output": "['()']"}
        ],
        "solution": """def generateParenthesis(n):
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result""",
        "solution_explanation": "Backtracking: add '(' if open < n, add ')' if close < open.",
        "constraints": "1 <= n <= 8",
        "time_complexity": "O(4^n / sqrt(n))",
        "space_complexity": "O(n)"
    },
    {
        "title": "Letter Combinations of Phone Number",
        "description": "Generate all letter combinations from phone number",
        "problem_statement": "Given a string containing digits 2-9, return all possible letter combinations that the number could represent.",
        "topic": "Backtracking",
        "difficulty": "medium",
        "examples": [
            {"input": "digits = '23'", "output": "['ad','ae','af','bd','be','bf','cd','ce','cf']"},
            {"input": "digits = ''", "output": "[]"}
        ],
        "solution": """def letterCombinations(digits):
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(index, current):
        if index == len(digits):
            result.append(current)
            return
        for letter in phone[digits[index]]:
            backtrack(index + 1, current + letter)
    
    backtrack(0, '')
    return result""",
        "solution_explanation": "Backtracking: for each digit, try all corresponding letters and recurse to next digit.",
        "constraints": "0 <= digits.length <= 4\ndigits[i] is a digit in range ['2', '9'].",
        "time_complexity": "O(4^n * n)",
        "space_complexity": "O(n)"
    },

    # ==================== HEAP / PRIORITY QUEUE (5 problems) ====================
    {
        "title": "Top K Frequent Words",
        "description": "Find k most frequent words",
        "problem_statement": "Given an array of strings words and integer k, return the k most frequent strings sorted by frequency. Ties broken alphabetically.",
        "topic": "Heap",
        "difficulty": "medium",
        "examples": [
            {"input": "words = ['i','love','leetcode','i','love','coding'], k = 2", "output": "['i','love']"},
        ],
        "solution": """def topKFrequent(words, k):
    from collections import Counter
    import heapq
    
    count = Counter(words)
    heap = [(-freq, word) for word, freq in count.items()]
    heapq.heapify(heap)
    
    return [heapq.heappop(heap)[1] for _ in range(k)]""",
        "solution_explanation": "Use min-heap with negative frequency so most frequent comes first. Ties broken by word order.",
        "constraints": "1 <= words.length <= 500\n1 <= words[i].length <= 10\nk is in range [1, unique words]",
        "time_complexity": "O(n log k)",
        "space_complexity": "O(n)"
    },
    {
        "title": "Find Median from Data Stream",
        "description": "Find median of a growing stream of numbers",
        "problem_statement": "Design a data structure to find median from a data stream. Implement addNum and findMedian.",
        "topic": "Heap",
        "difficulty": "hard",
        "examples": [
            {"input": "addNum(1), addNum(2), findMedian()→1.5, addNum(3), findMedian()→2.0", "output": "Operations work correctly"}
        ],
        "solution": """class MedianFinder:
    def __init__(self):
        self.small = []  # max heap (negate values)
        self.large = []  # min heap
    
    def addNum(self, num):
        import heapq
        heapq.heappush(self.small, -num)
        
        # Balance: ensure small's max <= large's min
        if self.small and self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Balance sizes
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2""",
        "solution_explanation": "Two heaps: max-heap for lower half, min-heap for upper half. Keep them balanced.",
        "constraints": "-10^5 <= num <= 10^5\nAt most 5 * 10^4 calls to addNum and findMedian.",
        "time_complexity": "O(log n) addNum, O(1) findMedian",
        "space_complexity": "O(n)"
    },

    # ==================== BIT MANIPULATION (5 problems) ====================
    {
        "title": "Single Number",
        "description": "Find element that appears only once",
        "problem_statement": "Given non-empty array where every element appears twice except for one, find that single one. Must run in O(n) time and O(1) space.",
        "topic": "Bit Manipulation",
        "difficulty": "easy",
        "examples": [
            {"input": "nums = [2,2,1]", "output": "1"},
            {"input": "nums = [4,1,2,1,2]", "output": "4"}
        ],
        "solution": """def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result""",
        "solution_explanation": "XOR: same numbers cancel out (a XOR a = 0), leaving only the single number.",
        "constraints": "1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element appears twice except for one.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Number of 1 Bits (Hamming Weight)",
        "description": "Count number of 1 bits in integer",
        "problem_statement": "Given a positive integer, return the number of set bits (1 bits) in its binary representation.",
        "topic": "Bit Manipulation",
        "difficulty": "easy",
        "examples": [
            {"input": "n = 11 (binary: 00000000000000000000000000001011)", "output": "3"},
            {"input": "n = 128 (binary: 10000000)", "output": "1"}
        ],
        "solution": """def hammingWeight(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

# Alternative (Brian Kernighan's algorithm):
def hammingWeight2(n):
    count = 0
    while n:
        n &= n - 1  # Remove rightmost set bit
        count += 1
    return count""",
        "solution_explanation": "n & (n-1) removes the rightmost set bit. Count how many times we can do this.",
        "constraints": "1 <= n <= 2^31 - 1",
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Reverse Bits",
        "description": "Reverse bits of a 32-bit integer",
        "problem_statement": "Reverse bits of a given 32 bits unsigned integer.",
        "topic": "Bit Manipulation",
        "difficulty": "easy",
        "examples": [
            {"input": "n = 00000010100101000001111010011100", "output": "00111001011110000010100101000000 (964176192)"},
        ],
        "solution": """def reverseBits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result""",
        "solution_explanation": "Extract LSB of n and append to result, shifting result left each time.",
        "constraints": "Input is a binary string of length 32.",
        "time_complexity": "O(1)",
        "space_complexity": "O(1)"
    },

    # ==================== MATRIX (5 problems) ====================
    {
        "title": "Rotate Image (Matrix)",
        "description": "Rotate n×n matrix 90 degrees clockwise",
        "problem_statement": "Given an n×n 2D matrix representing an image, rotate the image by 90 degrees clockwise in-place.",
        "topic": "Matrix",
        "difficulty": "medium",
        "examples": [
            {"input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]", "output": "[[7,4,1],[8,5,2],[9,6,3]]"},
        ],
        "solution": """def rotate(matrix):
    n = len(matrix)
    
    # Transpose (swap rows and columns)
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for row in matrix:
        row.reverse()""",
        "solution_explanation": "Transpose the matrix (swap across diagonal), then reverse each row.",
        "constraints": "n == matrix.length == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)"
    },
    {
        "title": "Spiral Matrix",
        "description": "Return all elements in spiral order",
        "problem_statement": "Given an m×n matrix, return all elements of the matrix in spiral order.",
        "topic": "Matrix",
        "difficulty": "medium",
        "examples": [
            {"input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]", "output": "[1,2,3,6,9,8,7,4,5]"},
        ],
        "solution": """def spiralOrder(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result""",
        "solution_explanation": "Use four boundaries (top, bottom, left, right) and traverse layer by layer.",
        "constraints": "m == matrix.length, n == matrix[i].length\n1 <= m, n <= 10",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m * n)"
    },
    {
        "title": "Set Matrix Zeroes",
        "description": "Set entire row/column to zero if element is zero",
        "problem_statement": "Given an m×n matrix, if an element is 0, set its entire row and column to 0. Do it in-place.",
        "topic": "Matrix",
        "difficulty": "medium",
        "examples": [
            {"input": "matrix = [[1,1,1],[1,0,1],[1,1,1]]", "output": "[[1,0,1],[0,0,0],[1,0,1]]"},
        ],
        "solution": """def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    rows, cols = set(), set()
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i)
                cols.add(j)
    
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                matrix[i][j] = 0""",
        "solution_explanation": "First pass: record which rows and columns have zeros. Second pass: set those rows/cols to zero.",
        "constraints": "m == matrix.length, n == matrix[0].length\n1 <= m, n <= 200\n-2^31 <= matrix[i][j] <= 2^31 - 1",
        "time_complexity": "O(m * n)",
        "space_complexity": "O(m + n)"
    },
]

# Add all problems to database
print("📊 Adding DSA problems...")
added = 0
for p in dsa_problems:
    # Check if already exists
    existing = db.query(DSAProblem).filter(DSAProblem.title == p["title"]).first()
    if not existing:
        problem = DSAProblem(**p)
        db.add(problem)
        added += 1

db.commit()
print(f"✅ Successfully added {added} new DSA problems!")

# Summary
total = db.query(DSAProblem).count()
print(f"\n📈 Database Summary:")
print(f"   Total DSA Problems: {total}")

topics = {}
for p in db.query(DSAProblem).all():
    topics[p.topic] = topics.get(p.topic, 0) + 1

print(f"\n   By Topic:")
for topic, count in sorted(topics.items()):
    print(f"   - {topic}: {count} problems")

print(f"\n   By Difficulty:")
for diff in ['easy', 'medium', 'hard']:
    count = db.query(DSAProblem).filter(DSAProblem.difficulty == diff).count()
    print(f"   - {diff.capitalize()}: {count} problems")

db.close()