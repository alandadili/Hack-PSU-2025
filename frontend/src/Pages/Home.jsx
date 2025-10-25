<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTrack - Mobile App</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .phone-container {
            max-width: 400px;
            width: 100%;
            height: 800px;
            background: white;
            border-radius: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .screen {
            flex: 1;
            overflow-y: auto;
            background: #f9fafb;
            padding-bottom: 80px;
        }

        .screen::-webkit-scrollbar {
            width: 0;
        }

        .hidden {
            display: none;
        }

        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px 24px;
            border-radius: 0 0 30px 30px;
            color: white;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .header p {
            font-size: 14px;
            color: #d1fae5;
        }

        .fire-icon {
            background: rgba(255,255,255,0.2);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        .stat-card {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 16px 12px;
            text-align: center;
        }

        .stat-card .number {
            font-size: 24px;
            font-weight: 700;
            color: white;
        }

        .stat-card .label {
            font-size: 11px;
            color: #d1fae5;
            margin-top: 4px;
        }

        /* Content Styles */
        .content {
            padding: 24px;
        }

        .tip-card {
            background: linear-gradient(to right, #f0fdf4, #ccfbf1);
            border-left: 4px solid #10b981;
            border-radius: 16px;
            padding: 16px;
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .tip-icon {
            background: #10b981;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .tip-content h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
        }

        .tip-content p {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.5;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .section-header h2 {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }

        .view-all {
            color: #10b981;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }

        .workout-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin-bottom: 24px;
        }

        .workout-header {
            background: linear-gradient(to right, #10b981, #14b8a6);
            padding: 20px;
            display: flex;
            justify-content: space-between;
        }

        .workout-header h3 {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin-bottom: 4px;
        }

        .workout-header .subtitle {
            font-size: 14px;
            color: #d1fae5;
        }

        .workout-time {
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 4px 10px;
            color: white;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
        }

        .workout-info {
            padding: 20px;
        }

        .workout-meta {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #6b7280;
        }

        .start-btn {
            width: 100%;
            background: #10b981;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.3s;
        }

        .start-btn:hover {
            background: #059669;
        }

        .week-progress {
            display: flex;
            gap: 8px;
            margin-bottom: 32px;
        }

        .day-item {
            flex: 1;
            text-align: center;
        }

        .day-box {
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            transition: all 0.3s;
        }

        .day-box.completed {
            background: #10b981;
        }

        .day-box.incomplete {
            background: #e5e7eb;
        }

        .day-label {
            font-size: 12px;
            color: #6b7280;
        }

        .day-label.completed {
            color: #10b981;
            font-weight: 600;
        }

        /* Exercise List */
        .exercise-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .exercise-item {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .exercise-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .exercise-item.completed {
            opacity: 0.6;
        }

        .checkbox {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s;
        }

        .checkbox.checked {
            background: #10b981;
        }

        .exercise-details {
            flex: 1;
        }

        .exercise-details h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
        }

        .exercise-meta {
            display: flex;
            gap: 12px;
            font-size: 13px;
            color: #6b7280;
        }

        .play-icon {
            color: #10b981;
            flex-shrink: 0;
        }

        /* Progress Screen */
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }

        .stat-box {
            border-radius: 16px;
            padding: 20px;
        }

        .stat-box.green {
            background: #f0fdf4;
        }

        .stat-box.orange {
            background: #fff7ed;
        }

        .stat-box.blue {
            background: #eff6ff;
        }

        .stat-box.purple {
            background: #faf5ff;
        }

        .stat-box .icon {
            font-size: 24px;
            margin-bottom: 12px;
        }

        .stat-box .value {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 4px;
        }

        .stat-box .label {
            font-size: 14px;
            color: #6b7280;
        }

        .progress-card {
            background: white;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 24px;
        }

        .progress-card h2 {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
        }

        /* Muscle Diagram */
        .muscle-diagram {
            background: white;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 24px;
        }

        .muscle-diagram h2 {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }

        .body-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
        }

        .body-outline {
            width: 200px;
            height: 350px;
            position: relative;
        }

        .muscle-group {
            position: absolute;
            cursor: pointer;
            transition: all 0.3s;
        }

        .muscle-group:hover {
            transform: scale(1.1);
        }

        .muscle-chest {
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 60px;
            background: rgba(16, 185, 129, 0.3);
            border: 2px solid #10b981;
            border-radius: 50% 50% 45% 45%;
            z-index: 2;
        }

        .muscle-arms {
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 80px;
            display: flex;
            justify-content: space-between;
            z-index: 1;
            pointer-events: none;
        }

        .muscle-arm {
            width: 30px;
            height: 80px;
            background: rgba(59, 130, 246, 0.3);
            border: 2px solid #3b82f6;
            border-radius: 15px;
            pointer-events: auto;
        }

        .muscle-abs {
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 70px;
            background: rgba(249, 115, 22, 0.3);
            border: 2px solid #f97316;
            border-radius: 15px;
            z-index: 2;
        }

        .muscle-back {
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 75px;
            height: 95px;
            background: rgba(234, 179, 8, 0.3);
            border: 2px solid #eab308;
            border-radius: 40% 40% 15px 15px;
            z-index: 0;
        }

        .muscle-legs {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90px;
            height: 120px;
            display: flex;
            justify-content: space-between;
            z-index: 1;
            pointer-events: none;
        }

        .muscle-leg {
            width: 35px;
            height: 120px;
            background: rgba(168, 85, 247, 0.3);
            border: 2px solid #a855f7;
            border-radius: 20px 20px 10px 10px;
            pointer-events: auto;
        }

        .muscle-stats {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .muscle-stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #f9fafb;
            border-radius: 12px;
        }

        .muscle-stat-item .name {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
        }

        .muscle-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .muscle-stat-item .level {
            font-size: 14px;
            font-weight: 600;
            color: #10b981;
        }

        .progress-item {
            margin-bottom: 20px;
        }

        .progress-item:last-child {
            margin-bottom: 0;
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .progress-header span {
            font-size: 14px;
            color: #6b7280;
        }

        .progress-header .percentage {
            font-weight: 600;
            color: #10b981;
        }

        .progress-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 999px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #10b981;
            border-radius: 999px;
            transition: width 0.5s ease;
        }

        .insight-card {
            background: linear-gradient(to right, #10b981, #14b8a6);
            border-radius: 20px;
            padding: 24px;
            color: white;
        }

        .insight-card h2 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .insight-card p {
            font-size: 14px;
            color: #d1fae5;
            line-height: 1.6;
        }

        /* Profile Screen */
        .profile-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px 24px;
            border-radius: 0 0 30px 30px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .avatar {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .profile-info h1 {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 4px;
        }

        .profile-info p {
            font-size: 14px;
            color: #d1fae5;
        }

        .info-card {
            background: white;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin-bottom: 16px;
        }

        .info-card h2 {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 16px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-row .label {
            color: #6b7280;
        }

        .info-row .value {
            font-weight: 600;
            color: #1f2937;
        }

        .achievements {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        .achievement {
            text-align: center;
        }

        .achievement-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 8px;
            font-size: 28px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .achievement-icon.yellow {
            background: #fef3c7;
        }

        .achievement-icon.green {
            background: #d1fae5;
        }

        .achievement-icon.purple {
            background: #f3e8ff;
        }

        .achievement-label {
            font-size: 12px;
            color: #6b7280;
        }

        .settings-btn {
            width: 100%;
            background: #f3f4f6;
            color: #1f2937;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .settings-btn:hover {
            background: #e5e7eb;
        }

        /* Bottom Navigation */
        .bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            padding: 12px 24px;
            display: flex;
            justify-content: space-around;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            color: #9ca3af;
            transition: color 0.3s;
        }

        .nav-item.active {
            color: #10b981;
        }

        .nav-item svg {
            width: 24px;
            height: 24px;
        }

        .nav-item span {
            font-size: 12px;
            font-weight: 500;
        }

        .complete-btn {
            margin: 0 24px 24px;
            width: calc(100% - 48px);
            background: #10b981;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .complete-btn:hover {
            background: #059669;
        }
    </style>
</head>
<body>
    <div class="phone-container">
        <!-- Home Screen -->
        <div id="home-screen" class="screen">
            <div class="header">
                <div class="header-top">
                    <div>
                        <h1>Hi, Alex! 👋</h1>
                        <p>Ready to crush today's workout?</p>
                    </div>
                    <div class="fire-icon">🔥</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="number">7</div>
                        <div class="label">Day Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="number">4</div>
                        <div class="label">This Week</div>
                    </div>
                    <div class="stat-card">
                        <div class="number">1250</div>
                        <div class="label">Calories</div>
                    </div>
                </div>
            </div>

            <div class="content">
                <div class="tip-card">
                    <div class="tip-icon">💡</div>
                    <div class="tip-content">
                        <h3>Pro Tip</h3>
                        <p>Focus on form over speed today. Your squat depth has improved 15% this week!</p>
                    </div>
                </div>

                <div class="section-header">
                    <h2>Today's Workout</h2>
                    <div class="view-all">View All</div>
                </div>

                <div class="workout-card">
                    <div class="workout-header">
                        <div>
                            <h3>Full Body Strength</h3>
                            <div class="subtitle">Customized for you</div>
                        </div>
                        <div class="workout-time">23 min</div>
                    </div>
                    <div class="workout-info">
                        <div class="workout-meta">
                            <div class="meta-item">
                                <span>💪</span>
                                <span>5 exercises</span>
                            </div>
                            <div class="meta-item">
                                <span>🔥</span>
                                <span>240 cal</span>
                            </div>
                        </div>
                        <button class="start-btn">
                            <span>▶</span>
                            Start Workout
                        </button>
                    </div>
                </div>

                <div class="section-header">
                    <h2>This Week</h2>
                </div>
                <div class="week-progress">
                    <div class="day-item">
                        <div class="day-box completed">✓</div>
                        <div class="day-label completed">Mon</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box completed">✓</div>
                        <div class="day-label completed">Tue</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box completed">✓</div>
                        <div class="day-label completed">Wed</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box completed">✓</div>
                        <div class="day-label completed">Thu</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box incomplete"></div>
                        <div class="day-label">Fri</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box incomplete"></div>
                        <div class="day-label">Sat</div>
                    </div>
                    <div class="day-item">
                        <div class="day-box incomplete"></div>
                        <div class="day-label">Sun</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Workout Screen -->
        <div id="workout-screen" class="screen hidden">
            <div class="header">
                <h1>Full Body Strength</h1>
                <p>5 exercises • 23 minutes • 240 calories</p>
            </div>

            <div class="content">
                <div class="exercise-list">
                    <div class="exercise-item" onclick="toggleExercise(this)">
                        <div class="checkbox"></div>
                        <div class="exercise-details">
                            <h3>Push-ups</h3>
                            <div class="exercise-meta">
                                <span>3x12</span>
                                <span style="color: #10b981;">• 5 min</span>
                                <span style="color: #f97316;">• 45 cal</span>
                            </div>
                        </div>
                        <div class="play-icon">▶</div>
                    </div>

                    <div class="exercise-item" onclick="toggleExercise(this)">
                        <div class="checkbox"></div>
                        <div class="exercise-details">
                            <h3>Squats</h3>
                            <div class="exercise-meta">
                                <span>3x15</span>
                                <span style="color: #10b981;">• 6 min</span>
                                <span style="color: #f97316;">• 60 cal</span>
                            </div>
                        </div>
                        <div class="play-icon">▶</div>
                    </div>

                    <div class="exercise-item" onclick="toggleExercise(this)">
                        <div class="checkbox"></div>
                        <div class="exercise-details">
                            <h3>Plank</h3>
                            <div class="exercise-meta">
                                <span>3x30s</span>
                                <span style="color: #10b981;">• 3 min</span>
                                <span style="color: #f97316;">• 30 cal</span>
                            </div>
                        </div>
                        <div class="play-icon">▶</div>
                    </div>

                    <div class="exercise-item" onclick="toggleExercise(this)">
                        <div class="checkbox"></div>
                        <div class="exercise-details">
                            <h3>Lunges</h3>
                            <div class="exercise-meta">
                                <span>3x10</span>
                                <span style="color: #10b981;">• 5 min</span>
                                <span style="color: #f97316;">• 50 cal</span>
                            </div>
                        </div>
                        <div class="play-icon">▶</div>
                    </div>

                    <div class="exercise-item" onclick="toggleExercise(this)">
                        <div class="checkbox"></div>
                        <div class="exercise-details">
                            <h3>Mountain Climbers</h3>
                            <div class="exercise-meta">
                                <span>3x20</span>
                                <span style="color: #10b981;">• 4 min</span>
                                <span style="color: #f97316;">• 55 cal</span>
                            </div>
                        </div>
                        <div class="play-icon">▶</div>
                    </div>
                </div>
            </div>

            <button class="complete-btn">Complete Workout</button>
        </div>

        <!-- Progress Screen -->
        <div id="progress-screen" class="screen hidden">
            <div class="content">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #1f2937;">Your Progress</h1>

                <div class="progress-card">
                    <h2>This Week</h2>
                    <div class="stats-cards">
                        <div class="stat-box green">
                            <div class="icon" style="color: #10b981;">💪</div>
                            <div class="value">4</div>
                            <div class="label">Workouts</div>
                        </div>
                        <div class="stat-box orange">
                            <div class="icon" style="color: #f97316;">🔥</div>
                            <div class="value">1250</div>
                            <div class="label">Calories</div>
                        </div>
                        <div class="stat-box blue">
                            <div class="icon" style="color: #3b82f6;">⏱️</div>
                            <div class="value">32m</div>
                            <div class="label">Avg Duration</div>
                        </div>
                        <div class="stat-box purple">
                            <div class="icon" style="color: #a855f7;">📈</div>
                            <div class="value">+12%</div>
                            <div class="label">Performance</div>
                        </div>
                    </div>
                </div>

                <!-- Muscle Diagram -->
                <div class="muscle-diagram">
                    <h2>Muscle Development</h2>
                    <div class="body-container">
                        <div class="body-outline">
                            <div class="muscle-group muscle-back" title="Back"></div>
                            <div class="muscle-group muscle-chest" title="Chest"></div>
                            <div class="muscle-group muscle-arms" title="Arms">
                                <div class="muscle-arm"></div>
                                <div class="muscle-arm"></div>
                            </div>
                            <div class="muscle-group muscle-abs" title="Core/Abs"></div>
                            <div class="muscle-group muscle-legs" title="Legs">
                                <div class="muscle-leg"></div>
                                <div class="muscle-leg"></div>
                            </div>
                        </div>
                    </div>
                    <div class="muscle-stats">
                        <div class="muscle-stat-item">
                            <div class="name">
                                <div class="muscle-dot" style="background: #10b981;"></div>
                                Chest
                            </div>
                            <div class="level">Level 8</div>
                        </div>
                        <div class="muscle-stat-item">
                            <div class="name">
                                <div class="muscle-dot" style="background: #3b82f6;"></div>
                                Arms
                            </div>
                            <div class="level">Level 7</div>
                        </div>
                        <div class="muscle-stat-item">
                            <div class="name">
                                <div class="muscle-dot" style="background: #eab308;"></div>
                                Back
                            </div>
                            <div class="level">Level 8</div>
                        </div>
                        <div class="muscle-stat-item">
                            <div class="name">
                                <div class="muscle-dot" style="background: #f97316;"></div>
                                Core
                            </div>
                            <div class="level">Level 9</div>
                        </div>
                        <div class="muscle-stat-item">
                            <div class="name">
                                <div class="muscle-dot" style="background: #a855f7;"></div>
                                Legs
                            </div>
                            <div class="level">Level 6</div>
                        </div>
                    </div>
                </div>

                <div class="progress-card">
                    <h2>Strength Gains</h2>
                    <div class="progress-item">
                        <div class="progress-header">
                            <span>Push-ups</span>
                            <span class="percentage">+25%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 75%;"></div>
                        </div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-header">
                            <span>Squats</span>
                            <span class="percentage">+18%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 60%;"></div>
                        </div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-header">
                            <span>Plank Hold</span>
                            <span class="percentage">+30%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 85%;"></div>
                        </div>
                    </div>
                </div>

                <div class="insight-card">
                    <h2>💪 Keep It Up!</h2>
                    <p>You're on track to reach your goal! Keep up the consistency and you'll see a 20% strength increase by month end.</p>
                </div>
            </div>
        </div>

        <!-- Profile Screen -->
        <div id="profile-screen" class="screen hidden">
            <div class="profile-header">
                <div class="avatar">👤</div>
                <div class="profile-info">
                    <h1>Alex Johnson</h1>
                    <p>Member since Jan 2025</p>
                </div>
            </div>

            <div class="content">
                <div class="info-card">
                    <h2>Goals</h2>
                    <div class="info-row">
                        <span class="label">Weight Goal</span>
                        <span class="value">165 lbs</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Weekly Workouts</span>
                        <span class="value">5 days</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Focus Area</span>
                        <span class="value">Strength</span>
                    </div>
                </div>

                <div class="info-card">
                    <h2>Achievements</h2>
                    <div class="achievements">
                        <div class="achievement">
                            <div class="achievement-icon yellow">🏆</div>
                            <div class="achievement-label">7 Day Streak</div>
                        </div>
                        <div class="achievement">
                            <div class="achievement-icon green">💪</div>
                            <div class="achievement-label">50 Workouts</div>
                        </div>
                        <div class="achievement">
                            <div class="achievement-icon purple">🔥</div>
                            <div class="achievement-label">5K Calories</div>
                        </div>
                    </div>
                </div>

                <button class="settings-btn">Settings</button>
            </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
            <div class="nav-item active" onclick="showScreen('home')">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.55 0 .85-.68.5-1.06l-9-8c-.3-.27-.76-.27-1.06 0l-9 8c-.35.38-.05 1.06.5 1.06z"/></svg>
                <span>Home</span>
            </div>
            <div class="nav-item" onclick="showScreen('workout')">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
                <span>Workout</span>
            </div>
            <div class="nav-item" onclick="showScreen('progress')">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                <span>Progress</span>
            </div>
            <div class="nav-item" onclick="showScreen('profile')">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                <span>Profile</span>
            </div>
        </div>
    </div>

    <script>
        function showScreen(screenName) {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.add('hidden');
            });
            
            // Show selected screen
            document.getElementById(screenName + '-screen').classList.remove('hidden');
            
            // Update nav active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.currentTarget.classList.add('active');
        }

        function toggleExercise(element) {
            const checkbox = element.querySelector('.checkbox');
            checkbox.classList.toggle('checked');
            element.classList.toggle('completed');
            
            if (checkbox.classList.contains('checked')) {
                checkbox.innerHTML = '✓';
                checkbox.style.color = 'white';
                checkbox.style.fontSize = '24px';
            } else {
                checkbox.innerHTML = '';
            }
        }
    </script>
</body>
</html>